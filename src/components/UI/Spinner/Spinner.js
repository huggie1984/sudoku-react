import React from 'react';
import classes from './Spinner.module.css';

const Spinner = (props) => {

    const miniSpinner = () => (
        <div className={classes['roller-mini']}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );

    const largeSpinner = () => (
    <div className={classes.roller}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    );

    return (props.isMini) ? miniSpinner() : largeSpinner();
};

export default Spinner;