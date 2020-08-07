import React from "react";
import {mount} from "enzyme";
import toJson from "enzyme-to-json";
import wait from 'waait';
import SingleItem, {SINGLE_ITEM_QUERY} from "../components/SingleItem";
import {MockedProvider} from "react-apollo/test-utils";
import {fakeItem} from "../lib/testUtils";

describe('<SingleItem/>', ()=>{
    it('renders with proper data', async ()=>{
        const mocks = [
            {
                // when someone makes a request with this query and var combo
                request: {query: SINGLE_ITEM_QUERY, variables: {id: "123"}},
                // then return this fake data (mocked)
                result: {data: {item: fakeItem()}}
            }
        ];
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <SingleItem id="123"/>
            </MockedProvider>
            );
        expect(wrapper.text()).toContain('Loading...');
        await wait(); // wait for the loading state to pass
        wrapper.update();
        // HUGE snapshots are not the best. The alternative is to snapshot individual pieces and test those
        expect(toJson(wrapper.find('h2'))).toMatchSnapshot();
        expect(toJson(wrapper.find('img'))).toMatchSnapshot();
        expect(toJson(wrapper.find('p'))).toMatchSnapshot();
    });

    it('Errors with a not found item', async ()=>{
        const mocks = [
            {
                request: {query: SINGLE_ITEM_QUERY, variables: {id: "123"}},
                result: {errors: [{message: "Items Not Found!"}]}
            }
        ];
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <SingleItem id="123"/>
            </MockedProvider>
        );
        await wait();
        wrapper.update();
        const item = wrapper.find('[data-test="graphql-error"]');
        expect(item.text()).toContain('Items Not Found!');
        expect(toJson(item)).toMatchSnapshot();
    });
});

