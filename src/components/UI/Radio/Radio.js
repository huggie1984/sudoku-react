import React from 'react';
import PropTypes from 'prop-types';

const Radio = (props) => {
    return (
        <div className={'my-2'}>
            <input
                onChange={props.handleChange}
                value={props.value}
                type="radio"
                id={props.id}
                checked={props.check === props.value}
                name={props.group}
            />
            <label htmlFor={props.id}>{props.label}</label>
        </div>
    )
};

export default Radio;

Radio.propTypes = {
    handleChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    group: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    check: PropTypes.any.isRequired
};
