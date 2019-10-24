import axios from 'axios';
import { store } from 'react-notifications-component';

import {logout} from './index'
import * as actionTypes from './actionTypes';
import { toastConfig } from '../../scripts/constants';


export const createPuzzle = (payload) => {
    return {
        type: actionTypes.CREATE_PUZZLE,
        difficulty: payload
    }
};

export const clearPuzzle = () => {
    return{
        type: actionTypes.CLEAR_PUZZLE
    }
};

export const deletePuzzleStart = () => {
    return {
        type: actionTypes.DELETE_PUZZLE_START
    }
};

export const deletePuzzleSuccess = () => {
    return {
        type: actionTypes.DELETE_PUZZLE_SUCCESS
    }
};

export const deletePuzzleFail = () => {
    return {
        type: actionTypes.DELETE_PUZZLE_FAIL
    }
};

export const saveGameStart = () => {
    return {
        type: actionTypes.SAVE_PUZZLE_START
    }
};

export const saveGameSuccess = (payload) => {
    return {
        type: actionTypes.SAVE_PUZZLE_SUCCESS,
        puzzle: payload
    }
};

export const saveGameFail = (payload) => {
    return {
        type: actionTypes.SAVE_PUZZLE_FAIL,
        error: payload
    }
};

export const getPuzzleStart = () => {
    return {
        type: actionTypes.GET_PUZZLE_START,
    }
};

export const getPuzzleSuccess = (payload) => {
    return {
        type: actionTypes.GET_PUZZLE_SUCCESS,
        gameData: payload.data
    }
};

export const getPuzzleFail = (error) => {
    return {
        type: actionTypes.GET_PUZZLE_FAIL,
        error: error
    }
};

export const onPuzzleInput = (payload) => {
    return {
        type: actionTypes.GAME_PUZZLE_INPUT,
        payload: payload 
    }
};

export const onPuzzleHighlight = (payload) => {
    return {
        type: actionTypes.GAME_PUZZLE_HIGHLIGHT,
        payload: payload
    }
};

export const initTime = () => {
    return {
        type: actionTypes.GAME_INIT_TIME
    }
};

export const updateTime = (payload) => {
    return { 
        type: actionTypes.GAME_UPDATE_TIME,
        payload: payload
    }
};

export const saveGameInfo = (data, token) => {
    return dispatch => {
        dispatch(saveGameStart());
        const url = 'https://sudoku-19bcc.firebaseio.com/users/' + data.userId + '/user-data.json?auth=' + token;
        axios.put(url, data)
        .then(res => {
            dispatch(saveGameSuccess(res));
              store.addNotification({...toastConfig,
                title: "Save!",
                message: "Successfully saved the puzzle!",
                type: "success"
              });
        })
        .catch(err => {
            dispatch(saveGameFail(err));
              store.addNotification({...toastConfig,
                title: "Error!",
                message: "Error saving puzzle data!",
                type: "danger"
              });
        })
    }
};

export const saveGameAndLogout = (data, token) =>  {
    return dispatch => {
        dispatch(saveGameStart());
        const url = 'https://sudoku-19bcc.firebaseio.com/users/' + data.userId + '/user-data.json?auth=' + token;
        axios.put(url, data)
            .then(res => {
                dispatch(saveGameSuccess(res));
                dispatch(logout());
                store.addNotification({...toastConfig,
                    title: "Save!",
                    message: "Successfully saved the puzzle!",
                    type: "success"
                });
            })
            .catch(err => {
                dispatch(saveGameFail(err));
                store.addNotification({...toastConfig,
                    title: "Error!",
                    message: "Error saving puzzle data!",
                    type: "danger"
                });
            })
    }
};

export const getPuzzle = (userId, token) => {
    return dispatch => {
        dispatch(getPuzzleStart(), token);
        const url = 'https://sudoku-19bcc.firebaseio.com/users/' + userId + '/user-data.json?auth=' + token;
        axios.get(url)
        .then(res => {
            dispatch(getPuzzleSuccess(res))
        })
        .catch(err => {
            dispatch(getPuzzleFail(err))
        })
    }
};

export const deletePuzzle = (userId, token) => {
    return dispatch => {
        dispatch(deletePuzzleStart());
        const url = 'https://sudoku-19bcc.firebaseio.com/users/' + userId + '/user-data.json?auth=' + token;
        axios.delete(url)
        .then(res => {
            dispatch(clearPuzzle());
            console.log('delete success', res);
        })
        .catch(err => {
            console.log('delete fail', err);
        })
    }
};
