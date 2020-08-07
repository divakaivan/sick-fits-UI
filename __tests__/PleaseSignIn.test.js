import React from "react";
import {mount} from "enzyme";
import wait from 'waait';
import PleaseSignIn from "../components/PleaseSignIn";
import {CURRENT_USER_QUERY} from "../components/User";
import {MockedProvider} from "react-apollo/test-utils";
import {fakeUser} from "../lib/testUtils";


const notSignedInMocks = [
    {
        request: {query: CURRENT_USER_QUERY},
        result: {data: {me: null}}
    }
];

const signInMocks = [
    {
        request: {query: CURRENT_USER_QUERY},
        result: {data: {me: fakeUser()}}
    }
];

describe('<PleaseSignIn/>', ()=>{
    it('renders the signed in dialog to logged out users', async ()=>{
        const wrapper = mount(
            <MockedProvider mocks={notSignedInMocks}>
                <PleaseSignIn/>
            </MockedProvider>
        );
        await wait();
        wrapper.update();
        expect(wrapper.text()).toContain('Please sign in, before continuing');
        expect(wrapper.find('Signin').exists()).toBe(true);
    });

    it('renders the child component when the user is signed in', async ()=>{
        const Hey = () => <p>Hey!</p>;
        const wrapper = mount(
            <MockedProvider mocks={signInMocks}>
                <PleaseSignIn><Hey/></PleaseSignIn>
            </MockedProvider>
        );
        await wait();
        wrapper.update(); // we need to manually update the wrapper after it has finished loading (from the wait())
        // expect(wrapper.find('Hey').exists()).toBe(true); alternative \/
        expect(wrapper.contains(<Hey/>)).toBe(true);
    })
});

