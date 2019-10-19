import axios from 'axios';

import * as actionTypes from './actionTypes';

const postLeaderBoardStart = () => {
    return {
        type: actionTypes.POST_LEADERBOARD_START
    }
};

const postLeaderBoardSuccess = () => {
    return {
        type: actionTypes.POST_LEADERBOARD_SUCCESS
    }
};

const postLeaderBoardFail = () => {
    return {
        type: actionTypes.POST_LEADERBOARD_FAIL
    }
};

export const postToLeaderBoards = (data, token) => {
    return dispatch => {
        dispatch(postLeaderBoardStart());
        const url = 'https://sudoku-19bcc.firebaseio.com/leaderboards.json?auth=' + token;

        axios.post(url, data)
        .then(res => {
            dispatch(postLeaderBoardSuccess(res));
            //navigate to
            console.log(res);
        })
        .catch(err => {
            dispatch(postLeaderBoardFail(err));
            console.log(err);
        })
    }
};