import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

import AppButton from '../../components/UI/Button/Button';
import classes from './Home.module.css';
import * as actions from '../../store/actions/index';
import Radio from '../../components/UI/Radio/Radio';


//todo rename to start page?
class Home extends Component {
    state = {
        radioGroup: [
            { value: 1, label: 'easy' },
            { value: 40, label: 'medium' },
            { value: 50, label: 'hard' }
        ],
        puzzleDifficulty: 1,
    };

    componentDidMount() {
        this.setState({...this.state, puzzleDifficulty: this.state.radioGroup[0].value});
        this.props.getSavedPuzzle(this.props.userId, this.props.token)
    }

     newGameClickHandler = () => {
        this.props.initTime();
        this.props.onCreatePuzzle(this.state.puzzleDifficulty);
        this.props.history.push('/game');
     };

     continueClickHandler = () => {
        this.props.history.push('/game');
     };

     onRadioChangeHandler = (event) => {
         const value = parseInt(event.target.value);
         this.setState({...this.state, puzzleDifficulty: value})
     };

    render() {
        const isCurrentGame = (this.props.puzzle.length > 0);
        let authRedirect = null;
        if (!this.props.isAuth) {
          authRedirect = <Redirect to={"/auth"}/>
        }

        return (
            <div className={classes.Home}>
                <div className={'d-flex flex-column'}>
                    { authRedirect }
                    <div className="mb-3 text-center">
                        <div className={classes.header}>Sudoku Home</div>
                    </div>
                    <div className="row">
                        <div className={'col-6 d-flex flex-column border-right'}>
                        {this.state.radioGroup.map(radio => (
                            <Radio
                                key={'puzzle_' + radio.value}
                                value={radio.value}
                                label={radio.label}
                                id={'puzzle_' + radio.value}
                                group={'puzzle_difficulty'}
                                check={this.state.puzzleDifficulty}
                                handleChange={(event) => this.onRadioChangeHandler(event)}/>
                        ))}
                        </div>
                        <div className={'col-6 d-flex flex-column justify-content-between'}>
                            <AppButton
                                variant={'success'}
                                label={'New Game'}
                                type={'button'}
                                clicked={() => this.newGameClickHandler()} />
                            <AppButton
                                variant={ 'success'}
                                loading={this.props.isLoadingGame}
                                label={'Resume Game'}
                                type={'button'}
                                clicked={() => this.continueClickHandler()}
                                disabled={!isCurrentGame || this.props.isLoadingGame} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoadingGame: state.game.loading,
        puzzle: state.game.puzzle,
        isAuth: state.auth.token !== null,
        token:  state.auth.token,
        userId: state.auth.userId
    }
};

const mapDispatchToProps = (dispatch) => {
    return{
        onCreatePuzzle: (difficulty) => dispatch(actions.createPuzzle(difficulty)),
        initTime: () => dispatch(actions.initTime()),
        getSavedPuzzle: (userId, token) => dispatch(actions.getPuzzle(userId, token))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));