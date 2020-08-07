import React from "react";
import {mount} from "enzyme";
import toJson from "enzyme-to-json";
import Router from "next/router";
import {MockedProvider} from "react-apollo/test-utils";
import CreateItem, {CREATE_ITEM_MUTATION} from "../components/CreateItem";
import wait from "waait";
import {fakeItem} from "../lib/testUtils";


const dogImage = 'https://dog.com/dog.png';
// mock the global fetch API
global.fetch = jest.fn().mockResolvedValue({
    json: () => ({
        secure_url: dogImage,
        eager: [{secure_url: dogImage}]
    })
});

describe('<CreateItem/>', ()=>{
    it('renders and matches snapshot', ()=>{
        const wrapper = mount(
            <MockedProvider>
                <CreateItem/>
            </MockedProvider>
        );
        const form = wrapper.find('form[data-test="form"]');
        expect(toJson(form)).toMatchSnapshot();
    });

    it('uploads a file when changed', async ()=>{
        const wrapper = mount(
            <MockedProvider>
                <CreateItem/>
            </MockedProvider>
        );
        const input = wrapper.find('input[type="file"]');
        input.simulate('change', {target: {files: ['fakedog.jpg']}});
        await wait();
        const component = wrapper.find('CreateItem').instance();
        // by changing the file name with any file name, we simulate a fetch going on. (global.fetch from the top of this file)
        expect(component.state.image).toEqual(dogImage);
        expect(component.state.largeImage).toEqual(dogImage);
        expect(global.fetch).toHaveBeenCalled();
        global.fetch.mockReset(); // because we modified the global fetch and resolved it with the dog pic, but for other tests, it needs to be the normal fetch
    });

    it('handles state updating', async ()=>{
        const wrapper = mount(
            <MockedProvider>
                <CreateItem/>
            </MockedProvider>
        );
        wrapper.find('#title').simulate('change', {target: {value: 'Testing', name: 'title'}});
        wrapper.find('#price').simulate('change', {target: {value: 50000, name: 'price', type: 'number'}});
        wrapper.find('#description').simulate('change', {target: {value: "This is a really nice item", name: 'description'}});
        expect(wrapper.find('CreateItem').instance().state).toMatchObject({
            title: 'Testing',
            price: 50000,
            description: 'This is a really nice item'
        });
    });

    it('creates an item when the form is submitted', async ()=>{
        const item = fakeItem();
        const mocks = [{
            request: {
                query: CREATE_ITEM_MUTATION,
                variables: {
                    title: item.title,
                    description: item.description,
                    image: '',
                    largeImage: '',
                    price: item.price
                }
            },
            result: {
                data: {
                    createItem: {
                        ...item,
                        id: "abc123",
                        __typename: 'Item'
                    }
                }
            }
        }];
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <CreateItem/>
            </MockedProvider>
        );
        // simulate someone filling out the form
        wrapper.find('#title').simulate('change', {target: {value: item.title, name: 'title'}});
        wrapper.find('#price').simulate('change', {target: {value: item.price, name: 'price', type: 'number'}});
        wrapper.find('#description').simulate('change', {target: {value: item.description, name: 'description'}});
        // mock the router
        Router.router = {push: jest.fn()};
        wrapper.find('form').simulate('submit');
        await wait(50);
        expect(Router.router.push).toHaveBeenCalled();
        expect(Router.router.push).toHaveBeenCalledWith({"pathname": "/item", "query": {"id": "abc123"}});
        // test that it successfully routed to the newly created item's page
    });
});

