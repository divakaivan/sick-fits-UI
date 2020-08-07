import React from "react";
import gql from "graphql-tag";
import {Query} from "react-apollo";
import Head from "next/head";
import Link from "next/link";

import PaginationStyles from "./styles/PaginationStyles";
import {perPage} from "../config";

export const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        # in the db this accepts a where input, but because we just need the items, 
        # aka we dont need to categorize or filter the items, we dont need to pass in anything
        itemsConnection {
            aggregate {
                count
            }
        }
    }
`;

const Pagination = props => (
    <Query query={PAGINATION_QUERY}>
        {({data, loading, error}) => {
            if (loading) return <p>Loading...</p>;
            const {count} = data.itemsConnection.aggregate;
            const pages = Math.ceil(count / perPage);
            return (
                <PaginationStyles data-test="pagination">
                    <Head>
                        <title>Sick Fits! Page {props.page} of {pages || 1}</title>
                    </Head>
                    <Link prefetch href={{
                        pathname: 'items',
                        query: {page: props.page - 1}
                    }}>
                        <a className="prev" aria-disabled={props.page <= 1}>{"<"} Prev</a>
                    </Link>
                    <p>Page {props.page} of <span className="totalPages">{pages || 1}</span></p>
                    <p>{count} Items total</p>
                    <Link prefetch href={{
                        pathname: 'items',
                        query: {page: props.page + 1}
                    }}>
                        <a className="next" aria-disabled={props.page >= pages}>Next {">"}</a>
                    </Link>
                </PaginationStyles>

            )
        }}
    </Query>
);

export default Pagination