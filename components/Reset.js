import React, {Component} from 'react';
import {Mutation} from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import {CURRENT_USER_QUERY} from "./User";


const RESET_MUTATION = gql`
    mutation RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
        resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
            id
            email
            name
        }
    }
`;

class Reset extends Component {
    state = {
        password: '',
        confirmPassword: ''
    };

    saveToState = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    render() {
        return (
            <Mutation mutation={RESET_MUTATION} refetchQueries={[{query: CURRENT_USER_QUERY}]} variables={{
                resetToken: this.props.resetToken,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            }}>
                {(reset, {error, loading, called})=>{
                    return <Form method="post" onSubmit={async (e)=>{
                        e.preventDefault();
                        await reset();
                        this.setState({password: '', confirmPassword: ''})
                    }
                    }>
                        {/* we need method=post, because by default form elements are GET and after submit,
                        it will refresh the page and put the submitted info in the url */}
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Reset your password</h2>
                            <Error error={error}/>
                            <label htmlFor="password">
                                Password
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your new password"
                                    value={this.state.password}
                                    onChange={this.saveToState}/>
                            </label>
                            <label htmlFor="confirmPassword">
                                Confirm your password
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm your new password"
                                    value={this.state.confirmPassword}
                                    onChange={this.saveToState}/>
                            </label>
                            <button type="submit">Reset password</button>
                        </fieldset>
                    </Form>
                }}
            </Mutation>
        );
    }
}

export default Reset;