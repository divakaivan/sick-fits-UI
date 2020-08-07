import React, {Component} from 'react';
import {Mutation} from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";


export const REQUEST_RESET_MUTATION = gql`
    mutation REQUEST_RESET_MUTATION($email: String!) {
        requestReset(email: $email) {
            message
        }
    }
`;

class RequestReset extends Component {
    state = {
        email: ''
    };

    saveToState = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    render() {
        return (
            <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
                {(reset, {error, loading, called})=>{
                    return <Form method="post" data-test="form" onSubmit={async (e)=>{
                        e.preventDefault();
                        await reset();
                        this.setState({email: ''});
                    }
                    }>
                        {/* we need method=post, because by default form elements are GET and after submit,
                        it will refresh the page and put the submitted info in the url */}
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Request a password reset</h2>
                            <Error error={error}/>
                            {!error && !loading && called && <p>Success! Check your email for a reset link!</p>}
                            <label htmlFor="email">
                                Email
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={this.state.email}
                                    onChange={this.saveToState}/>
                            </label>
                            <button type="submit">Request reset</button>
                        </fieldset>
                    </Form>
                }}
            </Mutation>
        );
    }
}

export default RequestReset;