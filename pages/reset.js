import Reset from "../components/Reset";
import React from "react";

const ResetPage = props => (
    <div>
        <Reset resetToken={props.query.resetToken}/>
    </div>
);

export default ResetPage;