import * as actionTypes from '../actions/actionTypes';

const initialState = {
    categoryData: null,
    subCategoryPageData: null,
    threadData: null,
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

const setThreadData = (state, action) => {
    const updatedState = {
        ...state,
        threadData: action.data,
        error: false
    }
    return updatedState;
};

const fetchThreadDataFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: true
    }
    return updatedState;
};

const createCategoryFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: false
    }
    return updatedState;
};

const createCategorySuccess = (state, action) => {
    const updatedState = {
        ...state,
        error: false
    }
    return updatedState;
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.SET_CATEGORY_DATA: return setCategoryData(state, action);
        case actionTypes.FETCH_CATEGORY_DATA_FAILED: return fetchCategoryDataFailed(state, action);
        case actionTypes.SET_SUB_CATEGORY_PAGE_DATA: return setSubCategoryPageData(state, action);
        case actionTypes.FETCH_SUB_CATEGORY_PAGE_DATA_FAILED: return fetchSubCategoryPageDataFailed(state, action);
        case actionTypes.SET_THREAD_DATA: return setThreadData(state, action);
        case actionTypes.FETCH_THREAD_DATA_FAILED: return fetchThreadDataFailed(state, action);
        case actionTypes.CREATE_CATEGORY_SUCCESS: return createCategorySuccess(state, action);
        case actionTypes.CREATE_CATEGORY_FAILED: return createCategoryFailed(state, action);
        default: return state;
    }
};

export default reducer;