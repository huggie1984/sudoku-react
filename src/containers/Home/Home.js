import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

import AppButton from '../../components/UI/Button/Button';
import classes from './Home.module.css';
import * as actions from '../../store/actions/index';

class Home extends Component {
    state = {
        selectGroup: [
            { value: 40, label: 'easy' },
            { value: 50, label: 'medium' },
            { value: 60, label: 'hard' }
        ],
        puzzleDifficulty: 40,
    };

    componentDidMount() {
        this.setState({...this.state, puzzleDifficulty: this.state.selectGroup[0].value});
        if(!this.props.puzzle || this.props.puzzle.length < 1) {
            this.props.getSavedPuzzle(this.props.userId, this.props.token);
        }
    }

     newGameClickHandler = () => {
        this.props.initTime();
        this.props.onCreatePuzzle(this.state.puzzleDifficulty);
        this.props.history.push('/game');
     };

     continueClickHandler = () => {
        this.props.history.push('/game');
     };

     onChangeHandler = (event) => {
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
                    <div className="row">
                        <div className={'col-sm-6 d-flex flex-sm-column'}>
                            <div className={'col font-weight-bold'}>Select difficulty</div>
                            <select className="custom-select custom-select-lg mb-3" onChange={(event) => this.onChangeHandler(event)}>
                                {this.state.selectGroup.map(radio => {
                                    return <option value={radio.value}>{radio.label}</option>
                                })}
                            </select>
                        </div>
                        <div className={'col-sm-6 d-flex flex-column my-auto'}>
                            <AppButton
                                variant={'success'}
                                label={'New Game'}
                                type={'button'}
                                clicked={() => this.newGameClickHandler()} />
                                <br/>
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
