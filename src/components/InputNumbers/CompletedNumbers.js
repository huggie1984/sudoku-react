import React from 'react';

import classes from './CompletedNumbers.module.css';

export const CompletedNumbers = (props) => {

    // TODO see if we can move functionality from parent here.

    return (
        <div className={classes.container + ' ' + 'my-2 mx-auto d-flex justify-content-between'}>
            {Object.keys(props.numbers)
                .map(key => {
                    return <input
                            key={key}
                            className={props.numbers[key].show ? classes.input: 'd-none'}
                            id={key}
                            readOnly
                            disabled
                            value={key}/>
                })}
        </div>
    )
};
