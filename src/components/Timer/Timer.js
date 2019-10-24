import React, { Component } from 'react';
import { connect } from 'react-redux'

import { formatTime } from '../../scripts/utils';
import * as actions from '../../store/actions/index';

// todo should this be a pure component.
// todo we shouldn't call the store every second.
// think of a better pragmatic way to store time.
class Timer extends Component {

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
