import React, { Component } from 'react';
import { connect } from 'react-redux'

import { formatTime } from '../../scripts/utils';
import * as actions from '../../store/actions/index';

class Timer extends React.PureComponent {

    timerInterval = null;

    startTimer = (currentTime) => {
        this.timerInterval = setInterval( ()=> {
            this.props.updateTime();
        }, 1000);
    };

    componentDidMount() {
        this.startTimer();
    }

    componentWillUnmount() {
        clearInterval(this.timerInterval);
    };

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

const mapDispatchToProps = (dispatch) => {
    return {
        updateTime: () => dispatch(actions.updateTime())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Timer);
