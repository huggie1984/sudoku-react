import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../store/actions/index';

import Wrapper from '../../hoc/Wrapper';
import Timer from '../../components/Timer/Timer';
import AppButton from '../../components/UI/Button/Button';
import { getUserInputCells, gridValidator } from '../../scripts/puzzleValidator';
import classes from './Game.module.css';

// get time, set time start time store time.
// on init, do we have a puzzle time?
// if we are using the loaded puzzle use the loadded puzzle time else time is started at 0,
// when the component will unmount we want to stop the interval, when the .
//todo stop the constanr redraws from the timer timer could be a pure-component?

class Game extends Component {

    timerInterval = null;

    state = {
        time: null
    };

    componentDidMount() {
        // use stored time if it is a resumed game
        console.log(this.props.storedTime);
        this.startTimer();
    }

    componentWillUnmount() {
        // update the store time when we leave this component.
        // this.props.updateTime();
        clearInterval(this.timerInterval);
    };

    startTimer = (currentTime) => {
        this.timerInterval = setInterval( ()=> {
            const currentTime = this.state.time;
            this.setState({...this.state, time: currentTime + 1});
            this.props.updateTime();
        }, 1000);
    };

    onCellSelected = (cell) => {
       this.props.onPuzzleHighlight(cell);
    };

    /**
     * create 9x9 grid
     */
    createPuzzle = () => {
        return (
            <div className={classes.content}>
                { this.props.puzzle.map((row, i) => {
                    return <Row key={i} className={classes.row}>
                        {row.map(cell => {
                            const cellValue = (cell.value > 0)? cell.value : '';
                            return (
                                <Col onClick={()=>this.onCellSelected(cell)} key={cell.row + '_' + cell.col} className={classes.cell}>
                                    <input
                                        className={cell.isHighlighted ? classes.myInput + ' ' + classes.highlight : classes.myInput}
                                        id={cell.row + '_' + cell.col}
                                        onChange={(event) => this.onInputChangeHandler(event)}
                                        type='number'
                                        disabled={cell.isDisabled}
                                        value={cellValue} />
                                </Col>
                            )
                        })}
                    </Row>
                })}
            </div>
        )
    };

    onInputChangeHandler = (event) => {
        this.props.onPuzzleInput({id: event.target.id, value: event.target.value})
    };

    checkSolutionHandler = () => {
        let isValid = false;
        const userCells = getUserInputCells(this.props.puzzle);
        for(let i = 0; i < userCells.length; i++) {
            let cell = userCells[i];
            isValid = gridValidator(cell, this.props.puzzle);
            if(!isValid) break;
        }
        if(isValid) {
            const notificationSettings = {
                text: 'Congratulations you completed the challenge',
                buttons: [
                    {text:'Publish to leader boards', callback: this.publishToLeaderboardHandler, variant:'success'},
                    {text:'Quit', callback: this.quitHandler, variant:'warning'},
                ]
            };
            this.props.notificationModal(notificationSettings);
        } else {
            const notificationSettings = {
                text: 'Oh! there seems to be a problem some where!',
                input: {value:'', onUpdate: ()=> console.log('update')},
                buttons: [{text:'Dismiss', callback: this.props.removeNotification, variant:'warning'}]
            };
            this.props.notificationModal(notificationSettings);
        }
    };

    saveProgressHandler = () => {
        const saveData = {
            puzzle: JSON.stringify(this.props.puzzle),
            userId: this.props.userId,
            time: this.props.storedTime,
        };
        return this.props.onSavePuzzle(saveData, this.props.token);
    };

    quitHandler = () => {
        this.props.onDeletePuzzle(this.props.userId, this.props.token);
        this.props.history.push('/home');// todo shouldn't go here until deleted.
        this.props.removeNotification();
    };

    publishToLeaderboardHandler = () => {
        const publishData = {time: this.props.storedTime, difficulty: this.props.difficulty, userName: this.props.userName};
        console.log(publishData);
        this.props.onPublishToLeaderBoards(publishData, this.props.token);
        this.props.onDeletePuzzle(this.props.userId, this.props.token);
        this.props.removeNotification();
    };
    
    render() {
        const grid = this.createPuzzle();
        return (
            <Wrapper>
                <Timer />
                <Container className={classes.container}>
                    { grid }
                </Container>
                <div className={"w-100 d-flex justify-content-center mt-3"}>
                    <AppButton variant={'success'} type={'button'} label={'Check Solution'} clicked={() => this.checkSolutionHandler()} />
                    <AppButton variant={'info'} type={'button'} label={'Save'} loading={this.props.loading} clicked={() => this.saveProgressHandler()} />
                </div>
            </Wrapper>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.game.loading,
        puzzle: state.game.puzzle,
        storedTime: state.game.time,
        userId: state.auth.userId,
        userName: state.auth.userName,
        token: state.auth.token,
        difficulty: state.game.difficulty
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        notificationModal: (messageSettings) => dispatch(actions.createNotifiactionModal(messageSettings)),
        removeNotification: () => dispatch(actions.removeNotification()),
        onPuzzleInput: (value) => dispatch(actions.onPuzzleInput(value)),
        onPuzzleHighlight: (cell) => dispatch(actions.onPuzzleHighlight(cell)),
        onSavePuzzle: (data, token) => dispatch(actions.saveGameInfo(data, token)),
        onPublishToLeaderBoards: (data, token) => dispatch(actions.postToLeaderBoards(data, token)),
        onDeletePuzzle: (userId, token) => dispatch(actions.deletePuzzle(userId, token)),
        updateTime: () => dispatch(actions.updateTime())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Game));
