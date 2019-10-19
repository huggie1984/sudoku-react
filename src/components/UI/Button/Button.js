import React from 'react';
import PropTypes from 'prop-types';
import classes from './Button.module.css';
import Spinner from "../Spinner/Spinner";

const AppButton = (props) => {
    const miniSpinner = () => (
        <span className={'d-flex align-items-center'}><Spinner isMini={true}/></span>
    );

    const btnClass = () => {
        switch(props.variant) {
            case 'success' : return classes.success;
            case 'info' : return classes.info;
            case 'warning' : return classes.warning;
            default: return classes.info;
        }
    };

    return (
        <button
            disabled={props.disabled}
            onClick={props.clicked}
            className={classes.button + ' ' + btnClass()}
            type={props.type} >
            {props.loading ? miniSpinner() : props.label}
        </button>
    );
};

export default AppButton;

AppButton.propTypes = {
    variant: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    clicked: PropTypes.func,
    loading: PropTypes.bool,
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
};