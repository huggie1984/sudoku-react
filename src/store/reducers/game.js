import * as actionTypes from '../actions/actionTypes';
import { generatePuzzle } from '../../scripts/puzzleGenerator';
import { updateObject } from '../../scripts/utils';

const initialState = {
    puzzle: [],
    time: 0,
    difficulty: null,
    loading: false
};

const createPuzzle = (state, action) => {
    // set difficulty here
    const newPuzzle = generatePuzzle(action.difficulty);
    return updateObject(state, {
            puzzle: newPuzzle,
            difficulty: action.difficulty
        });
};

const updatePuzzleInput = (state, action) => {
    let newPuzzle = [...state.puzzle];
    for (let r = 0; r < newPuzzle.length; r++) {
        for(let c = 0; c < newPuzzle[r].length; c++) {
            if (newPuzzle[r][c].id !== action.payload.id) continue;
            newPuzzle[r][c].value = action.payload.value;
        }
    }
    return updateObject(state, {puzzle: newPuzzle});
};

const clearPuzzle = (state) => {
    return updateObject(state, {
        puzzle: [],
        time: 0,
        difficulty: null
    })
};

const initTimer = (state) => {
    return updateObject(state, {time: 0});
};

const updateTime = (state) => {
    return updateObject(state, {time: state.time + 1});
};

const getPuzzleStart = (state) => {
    return updateObject(state, {
        loading: true
    });
};

const getPuzzleSuccess = (state, action) => {
    const newPuzzle = JSON.parse(action.gameData.puzzle);
    return updateObject(state, {
        puzzle: newPuzzle,
        time: action.gameData.time,
        loading: false
    });
};

const getPuzzleFail = (state) => {
    return updateObject(state, {
        loading: false
    });
};

const savePuzzleStart = (state) => {
    return updateObject(state, {
        loading: true
    });
};

const savePuzzleSuccess = (state) => {
    return updateObject(state, {
        loading: false
    });
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.CREATE_PUZZLE: return createPuzzle(state, action);
        case actionTypes.CLEAR_PUZZLE: return clearPuzzle(state, action);
        case actionTypes.GAME_PUZZLE_INPUT: return updatePuzzleInput(state, action);
        case actionTypes.GAME_INIT_TIME: return initTimer(state, action);
        case actionTypes.GAME_UPDATE_TIME: return updateTime(state, action);
        case actionTypes.GET_PUZZLE_START: return getPuzzleStart(state, action);
        case actionTypes.GET_PUZZLE_SUCCESS: return getPuzzleSuccess(state, action);
        case actionTypes.GET_PUZZLE_FAIL: return getPuzzleFail(state, action);
        case actionTypes.SAVE_PUZZLE_START: return savePuzzleStart(state);
        case actionTypes.SAVE_PUZZLE_SUCCESS: return savePuzzleSuccess(state);
        default: return state;
    }
};

export default reducer;