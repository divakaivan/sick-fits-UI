import React from "react";
import {shallow, mount} from "enzyme";
import toJson from "enzyme-to-json";
import CartCount from "../components/CartCount";


describe('<CartCount/>', ()=>{
    it('renders', ()=>{
        shallow(<CartCount count={10}/>) // since its test to render we dont need an expect here. because
        // if something goes wrong with shallow rendering then that's going to fail the test.
    });

    it('matches the snapshot', ()=>{
        const wrapper = shallow(<CartCount count={10}/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('updates via props', ()=>{
        const wrapper = shallow(<CartCount count={50}/>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.setProps({count: 10});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
