import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../scripts/utils';

const initialState = {
    token: null,
    userId: null,
    userName: 'none set',
    error: null,
    loading: false
};

const authStart = (state) => {
    return updateObject(state, {error: null, loading: true});
};

const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.payload.idToken,
        userId: action.payload.localId,
        userName: action.payload.displayName,
        error: null,
        loading: false
    })
};

const authFail = (state, action) => {
    return updateObject(state, {
        error: action.payload,
        loading: false
    })
};

const authLogout = (state) => {
    return updateObject(state, {token: null, userId: null});
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.AUTH_START:                return authStart(state, action);
        case actionTypes.AUTH_SUCCESS:              return authSuccess(state, action);
        case actionTypes.AUTH_FAIL:                 return authFail(state, action);
        case actionTypes.AUTH_LOGOUT:               return authLogout(state, action);
        default: return state;
    }
};

export default reducer;
