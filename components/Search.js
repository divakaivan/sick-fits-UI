import React from "react";
import Downshift, {resetIdCounter} from "downshift";
import Router from "next/router";
import {ApolloConsumer} from "react-apollo"; // this allows queries to run on demand, not on page load
import gql from "graphql-tag";
import debounce from "lodash.debounce"
import {DropDown, DropDownItem, SearchStyles} from "./styles/DropDown";


const SEARCH_ITEMS_QUERY = gql`
    query SEARCH_ITEMS_QUERY($searchTerm: String!) {
        items(where: {
            OR: [
                {title_contains: $searchTerm},
                {description_contains: $searchTerm}
            ],
        }) {
            id
            image
            title
        }
    }
`;

function routeToItem(item) {
    Router.push({
        pathname: "/item",
        query: {
            id: item.id
        }
    })
}

class AutoComplete extends React.Component {

    state = {
        items: [],
        loading: false,
    };

    /**
     * Because this is used for the search bar and we dont want to fire a query to search for items on every key stroke.
     * I.e. the user types belt - a query will be ran for b, be, bel and belt.
     * This is where debounce from lodash comes in. It will take all those quick change events that are fired
     * within 350 (the 2nd argument passed) ms and fire off one run of the query.
     */
    onChange = debounce(async (e, client) => {
        // turn loading on
        this.setState({loading: true});
        // manually query apollo client
        const res = await client.query({
            query: SEARCH_ITEMS_QUERY,
            variables: {searchTerm: e.target.value}
        });
        this.setState({
            items: res.data.items,
            loading: false
        })
    }, 350);

    render() {
        resetIdCounter();
        return (
            <SearchStyles>
                <Downshift onChange={routeToItem} itemToString={item => (item === null ? "" : item.title)}>
                    {({getInputProps, getItemProps, isOpen, inputValue, highlightedIndex}) => (

                        <div>
                            <ApolloConsumer>
                                {(client) => (
                                    <input {...getInputProps({
                                        type: "search",
                                        placeholder: "Search for an item",
                                        id: "search",
                                        className: this.state.loading ? "loading" : "",
                                        onChange: e => {
                                            e.persist();
                                            this.onChange(e, client);
                                        }

                                    })} />
                                )}
                            </ApolloConsumer>
                            {isOpen && (
                                <DropDown>
                                    {this.state.items.map((item, i) =>
                                        <DropDownItem {...getItemProps({item})} key={item.id}
                                                      highlighted={i === highlightedIndex}>
                                            <img src={item.image} width="50" alt={item.title}/>
                                            {item.title}
                                        </DropDownItem>
                                    )}
                                    {!this.state.items.length && !this.state.loading && (
                                        <DropDownItem>
                                            Nothing found for {inputValue}
                                        </DropDownItem>
                                    )}
                                </DropDown>
                            )}
                        </div>
                    )}
                </Downshift>
            </SearchStyles>
        )
    }
}

export default AutoComplete;