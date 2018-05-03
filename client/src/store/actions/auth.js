import * as actionTypes from './actionTypes';

export const fetchUserInit = () => {
    return {
        type: actionTypes.FETCH_USER_INIT
    };
};

export const fetchUserSuccess = (data) => {
    return {
        type: actionTypes.FETCH_USER_SUCCESS,
        data: data
    };
};

export const logoutUserInit = () => {
    return {
        type: actionTypes.LOGOUT_USER_INIT
    };
};

export const logoutUserSuccess = () => {
    return {
        type: actionTypes.LOGOUT_USER_SUCCESS
    };
};