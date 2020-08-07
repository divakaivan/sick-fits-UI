import React from "react";
import Item from "../components/Item";
import {shallow} from "enzyme";
import toJson from "enzyme-to-json";


const fakeItem = {
    id: "ABC123",
    title: "A cool item",
    price: 5000,
    description: "Really cool item!",
    image: "dog.jpg",
    largeImage: "largeDog.jpg"
};

describe('<Item/>', ()=>{
    it('renders and matches the snapshot', ()=>{
        const wrapper = shallow(<Item item={fakeItem}/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    // it('renders the image properly', ()=>{
    //     const wrapper = shallow(<ItemComponent item={fakeItem}/>);
    //     const img = wrapper.find('img');
    //     expect(img.props().src).toBe(fakeItem.image); // .props() give an object with key/value of prop/value
    //     expect(img.props().alt).toBe(fakeItem.title);
    // });
    //
    // it('renders the priceTag and title properly', ()=>{
    //     const wrapper = shallow(<ItemComponent item={fakeItem}/>);
    //     const PriceTag = wrapper.find('PriceTag');
    //     expect(PriceTag.children().text()).toBe('$50');
    //     expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
    // });
    //
    // it('renders out the buttons properly', ()=>{
    //     const wrapper = shallow(<ItemComponent item={fakeItem}/>);
    //     const buttonList = wrapper.find('.buttonList');
    //     expect(buttonList.children()).toHaveLength(3);
    //     expect(buttonList.find('Link')).toBeTruthy();
    //     expect(buttonList.find('AddToCart').exists()).toBe(true); // another way
    //     expect(buttonList.find('DeleteItem').exists()).toBe(true);
    // });
});
