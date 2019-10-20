import React, { Component } from 'react';
import { connect } from 'react-redux'

import { formatTime } from '../../scripts/utils';
import * as actions from '../../store/actions/index';

// todo not use the store for the time out this should be done on component state.
class Timer extends Component {

    timerInterval = null;

    render() {
        return (
            <div className='d-flex flex-row'>
            <div className="col-6 text-right">Time elapsed</div>
            <div className="col-6 text-left">{formatTime(this.props.time)}</div>
          </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        time: state.game.time
    }
};

export default connect(mapStateToProps)(Timer);
