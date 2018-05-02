import * as actionTypes from '../actions/actionTypes';

const fetchUserSuccess = (state, action) => {
    return action.data || false;
};

const reducer = ( state = null, action ) => {
    switch ( action.type ) {

        case actionTypes.FETCH_USER_SUCCESS: return fetchUserSuccess(state, action);

        default: return state;
    }
};

export default reducer;