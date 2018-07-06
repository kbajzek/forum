import * as actionTypes from '../actions/actionTypes';

const initialState = {
    categoryData: null,
    subCategoryPageData: null,
    threadData: null,
    userData: null,
    userlistData: [],
    userlistLoading: false,
    messageData: null,
    postEditorData: null,
    postCreated: null,
    request_notifications: [],
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

const initCategoryDataFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};

const refreshCategoryDataFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
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

const initSubCategoryPageDataFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};

const refreshSubCategoryPageDataFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
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

const initThreadDataFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};

const refreshThreadDataFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};

const setUserData = (state, action) => {
    const updatedState = {
        ...state,
        userData: action.data,
        error: false
    }
    return updatedState;
};

const initUserDataFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};

const refreshUserDataFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};

const setMessageData = (state, action) => {
    const updatedState = {
        ...state,
        messageData: action.data,
        error: false
    }
    return updatedState;
};

const initMessageDataFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};

const refreshMessageDataFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};

// USER LIST

const fetchUserlistInit = (state, action) => {
    const updatedState = {
        ...state,
        userlistLoading: true,
        error: false
    }
    return updatedState;
};

const fetchUserlistSuccess = (state, action) => {
    const userlist = action.data || [];
    const updatedState = {
        ...state,
        userlistData: userlist,
        userlistLoading: false,
        error: false
    }
    return updatedState;
};

const fetchUserlistFailed = (state, action) => {
    const updatedState = {
        ...state,
        userlistLoading: false,
        error: action.error
    }
    return updatedState;
};

const createCategoryFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};

const createSubCategoryFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};

const createThreadFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};


const createPostFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};

const editPostFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};

const deletePostFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};

const createMessageFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};


const createMessagePostFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};

const editMessagePostFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};

const deleteMessagePostFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};

const createRatingFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {

        case actionTypes.SET_CATEGORY_DATA: return setCategoryData(state, action);
        case actionTypes.INIT_CATEGORY_DATA_FAILED: return initCategoryDataFailed(state, action);
        case actionTypes.REFRESH_CATEGORY_DATA_FAILED: return refreshCategoryDataFailed(state, action);

        case actionTypes.SET_SUB_CATEGORY_PAGE_DATA: return setSubCategoryPageData(state, action);
        case actionTypes.INIT_SUB_CATEGORY_PAGE_DATA_FAILED: return initSubCategoryPageDataFailed(state, action);
        case actionTypes.REFRESH_SUB_CATEGORY_PAGE_DATA_FAILED: return refreshSubCategoryPageDataFailed(state, action);

        case actionTypes.SET_THREAD_DATA: return setThreadData(state, action);
        case actionTypes.INIT_THREAD_DATA_FAILED: return initThreadDataFailed(state, action);
        case actionTypes.REFRESH_THREAD_DATA_FAILED: return refreshThreadDataFailed(state, action);

        case actionTypes.SET_USER_DATA: return setUserData(state, action);
        case actionTypes.INIT_USER_DATA_FAILED: return initUserDataFailed(state, action);
        case actionTypes.REFRESH_USER_DATA_FAILED: return refreshUserDataFailed(state, action);

        case actionTypes.SET_MESSAGE_DATA: return setMessageData(state, action);
        case actionTypes.INIT_MESSAGE_DATA_FAILED: return initMessageDataFailed(state, action);
        case actionTypes.REFRESH_MESSAGE_DATA_FAILED: return refreshMessageDataFailed(state, action);

        case actionTypes.FETCH_USERLIST_INIT: return fetchUserlistInit(state, action);
        case actionTypes.FETCH_USERLIST_SUCCESS: return fetchUserlistSuccess(state, action);
        case actionTypes.FETCH_USERLIST_FAILED: return fetchUserlistFailed(state, action);

        case actionTypes.CREATE_CATEGORY_FAILED: return createCategoryFailed(state, action);
        case actionTypes.CREATE_SUB_CATEGORY_FAILED: return createSubCategoryFailed(state, action);
        case actionTypes.CREATE_THREAD_FAILED: return createThreadFailed(state, action);
        case actionTypes.CREATE_POST_FAILED: return createPostFailed(state, action);
        case actionTypes.EDIT_POST_FAILED: return editPostFailed(state, action);
        case actionTypes.DELETE_POST_FAILED: return deletePostFailed(state, action);
        case actionTypes.CREATE_MESSAGE_FAILED: return createMessageFailed(state, action);
        case actionTypes.CREATE_MESSAGE_POST_FAILED: return createMessagePostFailed(state, action);
        case actionTypes.EDIT_MESSAGE_POST_FAILED: return editMessagePostFailed(state, action);
        case actionTypes.DELETE_MESSAGE_POST_FAILED: return deleteMessagePostFailed(state, action);

        case actionTypes.CREATE_RATING_FAILED: return createRatingFailed(state, action);

        default: return state;
    }
};

export default reducer;