import * as actionTypes from '../actions/actionTypes';

const initialState = {
    user: null,
    csrf: null,
    init: false
};

const fetchUserSuccess = (state, action) => {
    const updatedState = {
        user: action.user,
        csrf: action.csrf,
        init: true

    }
    return updatedState;
};

const logoutUserSuccess = (state, action) => {
    const updatedState = {
        user: null,
        csrf: null,
        init: true
    }
    return updatedState;
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {

        case actionTypes.FETCH_USER_SUCCESS: return fetchUserSuccess(state, action);
        case actionTypes.LOGOUT_USER_SUCCESS: return logoutUserSuccess(state, action);

        default: return state;
    }
};

export default reducer;