import * as actionTypes from './actionTypes';

export const setCategoryData = ( data ) => {
    return {
        type: actionTypes.SET_CATEGORY_DATA,
        data: data
    };
};

export const fetchCategoryDataFailed = () => {
    return {
        type: actionTypes.FETCH_CATEGORY_DATA_FAILED
    };
};

export const initCategoryData = () => {
    return {
        type: actionTypes.INIT_CATEGORY_DATA
    };
};

export const setSubCategoryPageData = ( data ) => {
    return {
        type: actionTypes.SET_SUB_CATEGORY_PAGE_DATA,
        data: data
    };
};

export const fetchSubCategoryPageDataFailed = () => {
    return {
        type: actionTypes.FETCH_SUB_CATEGORY_PAGE_DATA_FAILED
    };
};

export const initSubCategoryPageData = (path) => {
    return {
        type: actionTypes.INIT_SUB_CATEGORY_PAGE_DATA,
        path: path
    };
};

export const setThreadData = ( data ) => {
    return {
        type: actionTypes.SET_THREAD_DATA,
        data: data
    };
};

export const fetchThreadDataFailed = () => {
    return {
        type: actionTypes.FETCH_THREAD_DATA_FAILED
    };
};

export const initThreadData = (path) => {
    return {
        type: actionTypes.INIT_THREAD_DATA,
        path: path
    };
};

export const initCreateCategory = ( name ) => {
    return {
        type: actionTypes.INIT_CREATE_CATEGORY,
        name: name
    };
};

export const createCategoryFailed = (error) => {
    return {
        type: actionTypes.CREATE_CATEGORY_FAILED,
        error: error
    };
};

export const createCategorySuccess = () => {
    return {
        type: actionTypes.CREATE_CATEGORY_SUCCESS
    };
};