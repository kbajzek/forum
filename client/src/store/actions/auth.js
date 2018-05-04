import * as actionTypes from './actionTypes';

export const fetchUserInit = () => {
    return {
        type: actionTypes.FETCH_USER_INIT
    };
};

export const fetchUserSuccess = (user, csrf) => {
    return {
        type: actionTypes.FETCH_USER_SUCCESS,
        user: user,
        csrf: csrf
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