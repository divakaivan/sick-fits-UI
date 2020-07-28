import React, {Component} from 'react';
import {Mutation} from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import {CURRENT_USER_QUERY} from "./User";


const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION($email: String!, $password: String!) {
        signin(email: $email, password: $password) {
            id
            email
            name
        }
    }
`;

class Signin extends Component {
    state = {
        password: '',
        email: ''
    };

    saveToState = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    render() {
        return (
            <Mutation refetchQueries={[{query: CURRENT_USER_QUERY}]} mutation={SIGNIN_MUTATION} variables={this.state}>
                {(signup, {error, loading})=>{
                    return <Form method="post" onSubmit={async (e)=>{
                        e.preventDefault();
                        await signup();
                        this.setState({name: '', email: '', password: ''});
                    }
                    }>
                        {/* we need method=post, because by default form elements are GET and after submit,
                        it will refresh the page and put the submitted info in the url */}
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Sign in your account</h2>
                            <Error error={error}/>
                            <label htmlFor="email">
                                Email
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={this.state.email}
                                    onChange={this.saveToState}/>
                            </label>
                            <label htmlFor="password">
                                Password
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter a password"
                                    value={this.state.password}
                                    onChange={this.saveToState}/>
                            </label>
                            <button type="submit">Sign in!</button>
                        </fieldset>
                    </Form>
                }}
            </Mutation>
        );
    }
}

export default Signin;