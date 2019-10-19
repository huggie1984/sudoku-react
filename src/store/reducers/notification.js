import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../scripts/utils';

const initialState = {
    show: false,
    text: null,
    input: {},
    buttons: []
};

const createNotificationModal = (state, action) => {
     return updateObject(state, {
         show: true,
         text: action.messageSettings.text,
         buttons: [...action.messageSettings.buttons]
     });
};

const removeNotification = (state) => {
    return updateObject(state, {show: false});
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.CREATE_MODAL: return createNotificationModal(state, action);
        case actionTypes.DESTROY_MODAL: return removeNotification(state, action);
        default: return state;
    }
};

export default reducer;