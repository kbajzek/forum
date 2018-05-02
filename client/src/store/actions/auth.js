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