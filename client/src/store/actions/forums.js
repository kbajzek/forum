import * as actionTypes from './actionTypes';

// CATEGORY PAGE

export const setCategoryData = ( data ) => {
    return {
        type: actionTypes.SET_CATEGORY_DATA,
        data: data
    };
};

export const initCategoryData = () => {
    return {
        type: actionTypes.INIT_CATEGORY_DATA
    };
};

export const initCategoryDataFailed = (error) => {
    return {
        type: actionTypes.INIT_CATEGORY_DATA_FAILED,
        error: error
    };
};

export const refreshCategoryData = (path) => {
    return {
        type: actionTypes.REFRESH_CATEGORY_DATA,
        path: path
    };
};

export const refreshCategoryDataFailed = (error) => {
    return {
        type: actionTypes.REFRESH_CATEGORY_DATA_FAILED,
        error: error
    };
};



// SUBCATEGORY PAGE

export const setSubCategoryPageData = ( data ) => {
    return {
        type: actionTypes.SET_SUB_CATEGORY_PAGE_DATA,
        data: data
    };
};

export const initSubCategoryPageData = (path) => {
    return {
        type: actionTypes.INIT_SUB_CATEGORY_PAGE_DATA,
        path: path
    };
};

export const initSubCategoryPageDataFailed = (error) => {
    return {
        type: actionTypes.INIT_SUB_CATEGORY_PAGE_DATA_FAILED,
        error: error
    };
};

export const refreshSubCategoryPageData = (path) => {
    return {
        type: actionTypes.REFRESH_SUB_CATEGORY_PAGE_DATA,
        path: path
    };
};

export const refreshSubCategoryPageDataFailed = (error) => {
    return {
        type: actionTypes.REFRESH_SUB_CATEGORY_PAGE_DATA_FAILED,
        error: error
    };
};

// THREAD PAGE

export const setThreadData = ( data ) => {
    return {
        type: actionTypes.SET_THREAD_DATA,
        data: data
    };
};

export const initThreadData = (path) => {
    return {
        type: actionTypes.INIT_THREAD_DATA,
        path: path
    };
};

export const initThreadDataFailed = (error) => {
    return {
        type: actionTypes.INIT_THREAD_DATA_FAILED,
        error: error
    };
};

export const refreshThreadData = (path) => {
    return {
        type: actionTypes.REFRESH_THREAD_DATA,
        path: path
    };
};

export const refreshThreadDataFailed = (error) => {
    return {
        type: actionTypes.REFRESH_THREAD_DATA_FAILED,
        error: error
    };
};

// CATEGORY

export const createCategory = ( name ) => {
    return {
        type: actionTypes.CREATE_CATEGORY,
        name: name
    };
};

export const createCategoryFailed = (error) => {
    return {
        type: actionTypes.CREATE_CATEGORY_FAILED,
        error: error
    };
};

// SUBCATEGORY

export const createSubCategory = ( name, description, categoryId, subCategoryId, path ) => {
    return {
        type: actionTypes.CREATE_SUB_CATEGORY,
        name: name,
        description: description,
        categoryId: categoryId,
        subCategoryId: subCategoryId,
        path: path
    };
};

export const createSubCategoryFailed = (error) => {
    return {
        type: actionTypes.CREATE_SUB_CATEGORY_FAILED,
        error: error
    };
};

// THREAD

export const createThread = ( name, content, userId, subCategoryId, path ) => {
    return {
        type: actionTypes.CREATE_THREAD,
        name: name,
        content: content,
        userId: userId,
        subCategoryId: subCategoryId,
        path: path
    };
};

export const createThreadFailed = (error) => {
    return {
        type: actionTypes.CREATE_THREAD_FAILED,
        error: error
    };
};

// POST

export const createPost = ( content, userId, threadId, path, history ) => {
    return {
        type: actionTypes.CREATE_POST,
        content: content,
        userId: userId,
        threadId: threadId,
        path: path,
        history: history
    };
};

export const createPostFailed = (error) => {
    return {
        type: actionTypes.CREATE_POST_FAILED,
        error: error
    };
};