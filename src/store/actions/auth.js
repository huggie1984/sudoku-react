import axios from 'axios';
import { getPuzzle } from './game';
import { store } from 'react-notifications-component';

import * as actionTypes from './actionTypes';
import { toastConfig } from '../../scripts/constants';

const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
};

const authSuccess = (payload) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        payload: payload
    }
};

const authFail = (payload) => {
    return {
        type: actionTypes.AUTH_FAIL,
        payload: payload
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
};

const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            // todo renew token.
            dispatch(logout())
        }, expirationTime * 1000)
    };
};


export const checkAuthState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if(!token) {
            dispatch(logout());
        } else {
            const expirationDate  = new Date(localStorage.getItem('expirationDate'));
            if(expirationDate < new Date()) {
                dispatch(logout());
            } else {
                const userId = localStorage.getItem('userId');
                const userName = localStorage.getItem('userName');
                dispatch(authSuccess({idToken: token, localId: userId, userName: userName}));
                dispatch(checkAuthTimeout( (expirationDate.getTime() - new Date().getTime()) / 1000 ))
            }
        }
    }
};

export const auth = (email, password, userName, isLogin) => {
    return dispatch => {
        dispatch(authStart());
        const url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
        const requestType = isLogin ? 'signInWithPassword' : 'signUp';
        const apiKey = 'AIzaSyBavrXqCQ41dfjOgLH8AUh5WnpmiUy224A';
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        if(!isLogin) {
            authData.displayName = userName;
        }
        axios.post(url + requestType + '?key=' + apiKey, authData)
        .then(res => {
            const expirationDate = new Date (new Date().getTime() + res.data.expiresIn * 1000);
            localStorage.setItem('token', res.data.idToken);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('userId', res.data.localId);
            localStorage.setItem('userName', res.data.displayName);
            store.addNotification({...toastConfig,
                title: "Login!",
                message: "Login success.",
                type: "success",
              });
              dispatch(authSuccess(res.data));
              dispatch(getPuzzle(res.data.localId, res.data.idToken));
              dispatch(checkAuthTimeout(res.data.expiresIn));
        })
        .catch(err => {
              store.addNotification({...toastConfig,
                title: "Login!!",
                message: "Login fail",
                type: "danger"
              });
            dispatch(authFail(err))
        })
    }
};

