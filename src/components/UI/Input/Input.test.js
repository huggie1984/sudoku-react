import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Input from './Input';
import classes from './Input.module.css';

configure({adapter: new Adapter()});

describe('<Input />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<Input />);
    })

    it('should render an input element bt default', () => {
        expect (wrapper.find('input')).toBeTruthy();
    })

    it('should render an input element', () => {
        wrapper.setProps({elementType: 'input'});
        expect (wrapper.find('input')).toBeTruthy();
    })

    it('should render a text area element', () => {
        wrapper.setProps({elementType: 'textArea'});
        expect (wrapper.find('textarea')).toBeTruthy();
    })

    it('should render a select element', () => {
        wrapper.setProps({elementType: 'select', elementConfig: {
            options: [
                {value: 0, displayValue: 0}
            ]
        }});
        expect (wrapper.find('select')).toBeTruthy();
    })

})

