import React from "react";
import {mount} from "enzyme";
import toJson from "enzyme-to-json";
import {MockedProvider} from "react-apollo/test-utils";
import wait from "waait";
import {ApolloConsumer} from "react-apollo";
import Signup, {SIGNUP_MUTATION} from "../components/Signup";
import {CURRENT_USER_QUERY} from "../components/User";
import {fakeUser} from "../lib/testUtils";


function type(wrapper, name, value) {
    wrapper.find(`input[name="${name}"]`).simulate('change', {target: {name, value}})
}


const me = fakeUser();
const mocks = [
    // signup mock mutation
    {
        request: {query: SIGNUP_MUTATION, variables: {email: me.email, name: me.name, password: 'my-pass'}},
        result: {
            data: {
                signup: {
                    id: 'abc123',
                    ...me
                }
            }
        }
    },
    // current user query mock
    {
        request: {query: CURRENT_USER_QUERY},
        result: {
            data: {me}
        }
    }
];


describe('<Signup/>', () => {
    it('renders and matches snapshot', async () => {
        const wrapper = mount(
            <MockedProvider>
                <Signup/>
            </MockedProvider>
        );
        expect(toJson(wrapper.find('form'))).toMatchSnapshot();
    });

    it('calls the mutation properly', async () => {
        let apolloClient;
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <ApolloConsumer>
                    {client=>{
                        apolloClient = client;
                        return <Signup/>
                    }}
                </ApolloConsumer>
            </MockedProvider>
        );
        await wait();
        wrapper.update();
        type(wrapper, 'name', me.name);
        type(wrapper, 'email', me.email);
        type(wrapper, 'password', 'my-pass');
        wrapper.update();
        wrapper.find('form').simulate('submit');
        await wait();
        // query the user out of the apollo client
        // because once the signup mutation is finished.
        // the user should be logged in because we refetch the current user query (Signup.js)
        const user = await apolloClient.query({query: CURRENT_USER_QUERY});
        expect(user.data.me).toMatchObject(me);
    });
});
