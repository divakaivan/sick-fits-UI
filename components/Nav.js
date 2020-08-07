import Link from "next/link";
import React from "react";

import User from "./User";
import NavStyles from "./styles/NavStyles";
import Signout from "./Signout";
import {Mutation} from "react-apollo";
import {TOGGLE_CART_MUTATION} from "./Cart";
import CartCount from "./CartCount";

const Nav = () => (
    <User>
        {({data: {me}}) => (
            <NavStyles data-test="nav">
                <Link href="/items"><a>Shop</a></Link>
                {me && (
                    <> {/* because we use next.js which uses babel7, this is the same as React.Fragment */}
                        <Link href="/sell"><a>Sell</a></Link>
                        <Link href="/orders"><a>Orders</a></Link>
                        <Link href="/me"><a>Account</a></Link>
                        <Signout/>
                        <Mutation mutation={TOGGLE_CART_MUTATION}>
                            {toggleCart=>(
                                <button onClick={toggleCart}>My cart <CartCount
                                    count={me.cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)}/></button>
                            )}
                        </Mutation>
                    </>
                )}
                {!me && (
                    <Link href="/signup"><a>Sign in</a></Link>
                )}
            </NavStyles>
        )}
    </User>

);

export default Nav;