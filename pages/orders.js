import React from "react";
import OrderList from "../components/OrderList";

import PleaseSignIn from "../components/PleaseSignIn";

const OrdersPage = () => (
    <div>
        <PleaseSignIn>
            <OrderList />
        </PleaseSignIn>
    </div>
);


export default OrdersPage;