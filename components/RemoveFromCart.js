import React from "react";
import {Mutation} from "react-apollo";
import styled from "styled-components";
import PropTypes from "prop-types";
import gql from "graphql-tag";

import {CURRENT_USER_QUERY} from "./User";

export const REMOVE_FROM_CART_MUTATION = gql`
    mutation removeFromCart($id: ID!) {
        removeFromCart(id: $id) {
            id
        }
    }
`;

const BigButton = styled.button`
 font-size: 3rem;
 background: none;
 border: 0;
 &:hover {
  color: ${props => props.theme.red};
  cursor: pointer;
 }
`;

class RemoveFromCart extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired
    };

    // this gets called as soon as we get a response back from the server after a mutation
    // has been performed
    update = (cache, payload) => {
        // 1. read the cache
        const data = cache.readQuery({query: CURRENT_USER_QUERY});
        // 2. remove that item from the cart
        const cartItemId = payload.data.removeFromCart.id;
        data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId)
        // 3. write it back to the cache
        cache.writeQuery({query: CURRENT_USER_QUERY, data})
    };

    render() {
        return (
            <Mutation
                variables={{id: this.props.id}}
                mutation={REMOVE_FROM_CART_MUTATION}
                optimisticResponse={{
                    __typename: 'Mutation',
                    removeFromCart: {
                        __typename: 'CartItem',
                        id: this.props.id
                    }
                }} // this is what is returned immediately from the backend, so the delete operation is faster.
                // we fake the successful return because we assume it will be successful, and update the UI immediately,
                // but the backend still takes 1s or so to actually delete the item from the cart
                update={this.update}
            >
                {(removeFromCart, {loading, error}) => (
                    <BigButton onClick={() => {
                        removeFromCart().catch(err => alert(err.message));

                    }} disabled={loading} title="Delete Item">
                        &times;
                    </BigButton>
                )}
            </Mutation>
        );
    }
}

export default RemoveFromCart;