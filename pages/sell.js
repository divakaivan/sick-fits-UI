import React from "react";
import Link from "next/link";

import PleaseSignIn from "../components/PleaseSignIn";
import CreateItem from "../components/CreateItem";

class Sell extends React.Component {
    render() {
        return (
            <div>
                <PleaseSignIn>
                    <CreateItem/>
                </PleaseSignIn>
            </div>
        )
    }
}

export default Sell;