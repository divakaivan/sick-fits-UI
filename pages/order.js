import React from "react";
import Order from "../components/Order";

import PleaseSignIn from "../components/PleaseSignIn";

const OrderPage = (props) => (
    <div>
        <PleaseSignIn>
            <Order id={props.query.id}/>
        </PleaseSignIn>
    </div>
);


export default OrderPage;