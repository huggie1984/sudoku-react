import * as actionTypes from './actionTypes';

export const createNotifiactionModal = (payload) => {
    return {
        type: actionTypes.CREATE_MODAL,
        messageSettings: payload
    }
};

export const removeNotification = () => {
    return {
        type: actionTypes.DESTROY_MODAL
    }
};