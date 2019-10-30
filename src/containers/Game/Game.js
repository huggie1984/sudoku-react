import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../store/actions/index';

import Wrapper from '../../hoc/Wrapper';
import Timer from '../../components/Timer/Timer';
import { CompletedNumbers } from '../../components/InputNumbers/CompletedNumbers';
import AppButton from '../../components/UI/Button/Button';
import { getUserInputCells, gridValidator } from '../../scripts/puzzleValidator';
import classes from './Game.module.css';

class Game extends Component {

    state = {
        numberTotal: {
            '1': {show: false},
            '2': {show: false},
            '3': {show: false},
            '4': {show: false},
            '5': {show: false},
            '6': {show: false},
            '7': {show: false},
            '8': {show: false},
            '9': {show: false}
        }
    };

    componentDidMount() {
        for(const key in this.state.numberTotal) {
            this.checkNumberTotal(key);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log('do not update every interval');
    }

    onCellSelected = (cell) => {
        this.props.onPuzzleHighlight(cell);
    };

    onInputChangeHandler = (event) => {
        this.props.onPuzzleInput({id: event.target.id, value: event.target.value});
        if(event.target.value) {
            this.checkNumberTotal(event.target.value);
        } else {
            for(const key in this.state.numberTotal) {
                this.checkNumberTotal(key);
            }
        }
    };

    checkNumberTotal = (value) => {
        let count = 0;
        for(let r = 0; r < this.props.puzzle.length; r++) {
            for(let c = 0; c < this.props.puzzle[r].length; c++) {
                const cell = this.props.puzzle[r][c];
                if(parseInt(cell.value) !== parseInt(value)) continue;
                count ++;
            }
        }
        const newState = {...this.state};
        newState.numberTotal[value].show = (count >= 9);
        this.setState(newState);
    };

    /**
     * create 9x9 grid
     */
    createPuzzle = () => {
        return (
            <div className={classes.content}>
                { this.props.puzzle.map((row, i) => (
                    <Row key={i} className={classes.row}>
                        {row.map(cell => {
                            const cellValue = (cell.value > 0)? cell.value : '';
                            return (
                                <Col
                                    onClick={()=>this.onCellSelected(cell)}
                                    key={cell.row + '_' + cell.col}
                                    className={classes.cell}>
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
                    ))}
            </div>
        )
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
            time: this.props.time,
        };
        return this.props.onSavePuzzle(saveData, this.props.token);
    };

    quitHandler = () => {
        this.props.onDeletePuzzle(this.props.userId, this.props.token);
        this.props.history.push('/home');// todo shouldn't go here until deleted.
        this.props.removeNotification();
    };

    publishToLeaderboardHandler = () => {
        const publishData = {time: this.props.time, difficulty: this.props.difficulty, userName: this.props.userName};
        this.props.onPublishToLeaderBoards(publishData, this.props.token);
        this.props.onDeletePuzzle(this.props.userId, this.props.token);
        this.props.removeNotification();
    };
    
    render() {
        const grid = this.createPuzzle();
        return (
            <Wrapper>
                <Timer/>
                <CompletedNumbers numbers={this.state.numberTotal}/>
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
        time: state.game.time,
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
