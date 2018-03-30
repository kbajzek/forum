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