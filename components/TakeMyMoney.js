import React from "react";
import StripeCheckout from "react-stripe-checkout";
import {Mutation} from "react-apollo";
import Router from "next/router";
import NProgress from "nprogress";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import calcTotalPrice from "../lib/calcTotalPrice";
import Error from "./ErrorMessage";
import User, {CURRENT_USER_QUERY} from "./User";

function totalItems(cart) {
    return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

const CREATE_ORDER_MUTATION = gql`
    mutation createOrder($token: String!) {
        createOrder(token: $token) {
            id
            charge
            total
            items {
                id
                title
            }
        }
    }
`;


class TakeMyMoney extends React.Component {

    onToken = async (res, createOrder) => {
        NProgress.start();
        // call the mutation from here.
        const order = await createOrder({ // we can pass mutation variables from here as well
            variables: {
                token: res.id
            }
        }).catch(err=>alert(err.message));
        Router.push({
            pathname: "/order",
            query: {id: order.data.createOrder.id}
        });
    };

    render() {
        return (
            <User>
                {({data: {me}}) => (
                    <Mutation mutation={CREATE_ORDER_MUTATION} refetchQueries={[{query: CURRENT_USER_QUERY}]}>
                        {(createOrder) => (

                            <StripeCheckout
                                amount={calcTotalPrice(me.cart)}
                                name="Sick Fits"
                                description={`Order of ${totalItems(me.cart)} items`}
                                image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
                                stripeKey="pk_test_51HCmE9BiZYeN1Gv3wDGhkyMUs9rsFUtJD5ExlUfToLWvFaKJ6e30P4sERAf3gZ1M8SfVqlF5yeb87QQfdhRzz0en007B66Zaq3"
                                currency="USD"
                                email={me.email}
                                token={res => this.onToken(res, createOrder)}
                            >
                                {this.props.children}
                            </StripeCheckout>
                        )}
                    </Mutation>
                )}
            </User>
        );
    }
}

export default TakeMyMoney;

