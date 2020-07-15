import React from "react";
import SingleItem from "../components/SingleItem";

class Item extends React.Component {
    render() {
        return (
            <div>
                <SingleItem id={this.props.query.id}/>
            </div>
        )
    }
}

export default Item;