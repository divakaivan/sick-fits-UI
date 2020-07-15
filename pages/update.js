import React from "react";
import Link from "next/link";

import UpdateItem from "../components/UpdateItem";

class Sell extends React.Component {
    render() {
        return (
            <div>
                <UpdateItem id={this.props.query.id}/>
            </div>
        )
    }
}

export default Sell;