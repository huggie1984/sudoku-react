import React from 'react';
import { Form } from 'react-bootstrap';
import classes from './Input.module.css';
const input = (props) => {
    let element = null;
    const inputClasses = [classes.InputElement];
    
    if(props.invalid && props.shouldValidate && props.touched) {
        inputClasses.push(classes.Invalid);
    }

    switch(props.elementType) {
        case ('input'):
            element = <Form.Group>
                        <Form.Label >{props.label}</Form.Label>
                        <Form.Control value={props.value} 
                        {...props.elementConfig}   
                        onChange={props.changed} 
                        className={inputClasses.join(' ')}/>
                        </Form.Group>  
            break;
        case ('textArea'):  
            element = <textarea 
                        className={inputClasses.join(' ')} 
                        onChange={props.changed}
                        {...props.elementConfig} 
                        value={props.value}/>;  
        break;
        case ('select'):
            element = (
                <Form.Group>
                <Form.Label>{props.label}</Form.Label>
                <Form.Control as="select" onChange={props.changed}>
                {props.elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.displayValue}
                        </option>
                        )
                    )}
                </Form.Control>
              </Form.Group>
            )
        break;
        default: element = <input 
                            className={classes.InputElement} 
                            onChange={props.changed}
                            {...props.elementConfig} 
                            value={props.value}/>;                
        break;
    }

    return(
        <div className={classes.Input}>
            {element}
        </div>
    )
}

export default input;