import * as actionTypes from '../actions/actionTypes';

const initialState = {
    categoryData: null,
    subCategoryPageData: null,
    error: false
};
const setCategoryData = (state, action) => {
    const updatedState = {
        ...state,
        categoryData: action.data,
        error: false
    }
    return updatedState;
};

const fetchCategoryDataFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: true
    }
    return updatedState;
};

const setSubCategoryPageData = (state, action) => {
    const updatedState = {
        ...state,
        subCategoryPageData: action.data,
        error: false
    }
    return updatedState;
};

const fetchSubCategoryPageDataFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: true
    }
    return updatedState;
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.SET_CATEGORY_DATA: return setCategoryData(state, action);
        case actionTypes.FETCH_CATEGORY_DATA_FAILED: return fetchCategoryDataFailed(state, action);
        case actionTypes.SET_SUB_CATEGORY_PAGE_DATA: return setSubCategoryPageData(state, action);
        case actionTypes.FETCH_SUB_CATEGORY_PAGE_DATA_FAILED: return fetchSubCategoryPageDataFailed(state, action);
        default: return state;
    }
};

export default reducer;