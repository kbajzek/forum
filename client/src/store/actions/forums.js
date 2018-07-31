import * as actionTypes from './actionTypes';

// CATEGORY PAGE

// export const setCategoryData = ( data ) => {
//     return {
//         type: actionTypes.SET_CATEGORY_DATA,
//         data: data
//     };
// };

// export const initCategoryData = () => {
//     return {
//         type: actionTypes.INIT_CATEGORY_DATA
//     };
// };

// export const initCategoryDataFailed = (error) => {
//     return {
//         type: actionTypes.INIT_CATEGORY_DATA_FAILED,
//         error: error
//     };
// };

// export const refreshCategoryData = (path) => {
//     return {
//         type: actionTypes.REFRESH_CATEGORY_DATA,
//         path: path
//     };
// };

// export const refreshCategoryDataFailed = (error) => {
//     return {
//         type: actionTypes.REFRESH_CATEGORY_DATA_FAILED,
//         error: error
//     };
// };



// SUBCATEGORY PAGE

// export const setSubCategoryPageData = ( data ) => {
//     return {
//         type: actionTypes.SET_SUB_CATEGORY_PAGE_DATA,
//         data: data
//     };
// };

// export const initSubCategoryPageData = (path) => {
//     return {
//         type: actionTypes.INIT_SUB_CATEGORY_PAGE_DATA,
//         path: path
//     };
// };

// export const initSubCategoryPageDataFailed = (error) => {
//     return {
//         type: actionTypes.INIT_SUB_CATEGORY_PAGE_DATA_FAILED,
//         error: error
//     };
// };

// export const refreshSubCategoryPageData = (path) => {
//     return {
//         type: actionTypes.REFRESH_SUB_CATEGORY_PAGE_DATA,
//         path: path
//     };
// };

// export const refreshSubCategoryPageDataFailed = (error) => {
//     return {
//         type: actionTypes.REFRESH_SUB_CATEGORY_PAGE_DATA_FAILED,
//         error: error
//     };
// };

// THREAD PAGE

// export const setThreadData = ( data ) => {
//     return {
//         type: actionTypes.SET_THREAD_DATA,
//         data: data
//     };
// };

// export const initThreadData = (path) => {
//     return {
//         type: actionTypes.INIT_THREAD_DATA,
//         path: path
//     };
// };

// export const initThreadDataFailed = (error) => {
//     return {
//         type: actionTypes.INIT_THREAD_DATA_FAILED,
//         error: error
//     };
// };

// export const refreshThreadData = (path) => {
//     return {
//         type: actionTypes.REFRESH_THREAD_DATA,
//         path: path
//     };
// };

// export const refreshThreadDataFailed = (error) => {
//     return {
//         type: actionTypes.REFRESH_THREAD_DATA_FAILED,
//         error: error
//     };
// };

// USER PAGE

export const setUserData = ( data ) => {
    return {
        type: actionTypes.SET_USER_DATA,
        data: data
    };
};

export const initUserData = (path) => {
    return {
        type: actionTypes.INIT_USER_DATA,
        path: path
    };
};

export const initUserDataFailed = (error) => {
    return {
        type: actionTypes.INIT_USER_DATA_FAILED,
        error: error
    };
};

export const refreshUserData = (path) => {
    return {
        type: actionTypes.REFRESH_USER_DATA,
        path: path
    };
};

export const refreshUserDataFailed = (error) => {
    return {
        type: actionTypes.REFRESH_USER_DATA_FAILED,
        error: error
    };
};

// MESSAGE PAGE

export const setMessageData = ( data ) => {
    return {
        type: actionTypes.SET_MESSAGE_DATA,
        data: data
    };
};

export const initMessageData = (path) => {
    return {
        type: actionTypes.INIT_MESSAGE_DATA,
        path: path
    };
};

export const initMessageDataFailed = (error) => {
    return {
        type: actionTypes.INIT_MESSAGE_DATA_FAILED,
        error: error
    };
};

export const refreshMessageData = (path) => {
    return {
        type: actionTypes.REFRESH_MESSAGE_DATA,
        path: path
    };
};

export const refreshMessageDataFailed = (error) => {
    return {
        type: actionTypes.REFRESH_MESSAGE_DATA_FAILED,
        error: error
    };
};

export const selectMessageData = (path, history) => {
    return {
        type: actionTypes.SELECT_MESSAGE_DATA,
        path: path,
        history: history
    };
};

export const selectMessageDataFailed = (error) => {
    return {
        type: actionTypes.SELECT_MESSAGE_DATA_FAILED,
        error: error
    };
};

export const setMessagePostData = ( data ) => {
    return {
        type: actionTypes.SET_MESSAGE_POST_DATA,
        data: data
    };
};

// USER LIST

export const fetchUserlistInit = ( search ) => {
    return {
        type: actionTypes.FETCH_USERLIST_INIT,
        search: search
    };
};

export const fetchUserlistSuccess = (data) => {
    return {
        type: actionTypes.FETCH_USERLIST_SUCCESS,
        data: data
    };
};

export const fetchUserlistFailed = (error) => {
    return {
        type: actionTypes.FETCH_USERLIST_FAILED,
        error: error
    };
};

// CATEGORY

// export const createCategory = ( name ) => {
//     return {
//         type: actionTypes.CREATE_CATEGORY,
//         name: name
//     };
// };

// export const createCategoryFailed = (error) => {
//     return {
//         type: actionTypes.CREATE_CATEGORY_FAILED,
//         error: error
//     };
// };



// SUBCATEGORY

// export const createSubCategory = ( name, description, categoryId, subCategoryId, path ) => {
//     return {
//         type: actionTypes.CREATE_SUB_CATEGORY,
//         name: name,
//         description: description,
//         categoryId: categoryId,
//         subCategoryId: subCategoryId,
//         path: path
//     };
// };

// export const createSubCategoryFailed = (error) => {
//     return {
//         type: actionTypes.CREATE_SUB_CATEGORY_FAILED,
//         error: error
//     };
// };

// THREAD

// export const createThread = ( name, content, userId, subCategoryId, path, history ) => {
//     return {
//         type: actionTypes.CREATE_THREAD,
//         name: name,
//         content: content,
//         userId: userId,
//         subCategoryId: subCategoryId,
//         path: path,
//         history: history
//     };
// };

// export const createThreadFailed = (error) => {
//     return {
//         type: actionTypes.CREATE_THREAD_FAILED,
//         error: error
//     };
// };

// POST

// export const createPost = ( content, userId, threadId, path, history ) => {
//     return {
//         type: actionTypes.CREATE_POST,
//         content: content,
//         userId: userId,
//         threadId: threadId,
//         path: path,
//         history: history
//     };
// };

// export const createPostFailed = (error) => {
//     return {
//         type: actionTypes.CREATE_POST_FAILED,
//         error: error
//     };
// };

// export const editPost = ( content, postId, path, history ) => {
//     return {
//         type: actionTypes.EDIT_POST,
//         content: content,
//         postId: postId,
//         path: path,
//         history: history
//     };
// };

// export const editPostFailed = (error) => {
//     return {
//         type: actionTypes.EDIT_POST_FAILED,
//         error: error
//     };
// };

// export const deletePost = (postId, path, history) => {
//     return {
//         type: actionTypes.DELETE_POST,
//         postId: postId,
//         path: path,
//         history: history
//     };
// };

// export const deletePostFailed = (error) => {
//     return {
//         type: actionTypes.DELETE_POST_FAILED,
//         error: error
//     };
// };

// MESSAGE

export const createMessage = ( name, content, members, path, history ) => {
    return {
        type: actionTypes.CREATE_MESSAGE,
        name: name,
        content: content,
        members: members,
        path: path,
        history: history
    };
};

export const createMessageFailed = (error) => {
    return {
        type: actionTypes.CREATE_MESSAGE_FAILED,
        error: error
    };
};

// MESSAGE POST

export const createMessagePost = ( content, messageId, path, history ) => {
    return {
        type: actionTypes.CREATE_MESSAGE_POST,
        content: content,
        messageId: messageId,
        path: path,
        history: history
    };
};

export const createMessagePostFailed = (error) => {
    return {
        type: actionTypes.CREATE_MESSAGE_POST_FAILED,
        error: error
    };
};

export const editMessagePost = ( content, messagePostId, path, history ) => {
    return {
        type: actionTypes.EDIT_MESSAGE_POST,
        content: content,
        messagePostId: messagePostId,
        path: path,
        history: history
    };
};

export const editMessagePostFailed = (error) => {
    return {
        type: actionTypes.EDIT_MESSAGE_POST_FAILED,
        error: error
    };
};

export const deleteMessagePost = (messagePostId, path, history) => {
    return {
        type: actionTypes.DELETE_MESSAGE_POST,
        messagePostId: messagePostId,
        path: path,
        history: history
    };
};

export const deleteMessagePostFailed = (error) => {
    return {
        type: actionTypes.DELETE_MESSAGE_POST_FAILED,
        error: error
    };
};

// RATING

// export const createRating = ( userId, ratingTypeId, postId, path ) => {
//     return {
//         type: actionTypes.CREATE_RATING,
//         userId: userId,
//         ratingTypeId: ratingTypeId,
//         postId: postId,
//         path: path
//     };
// };

// export const createRatingFailed = (error) => {
//     return {
//         type: actionTypes.CREATE_RATING_FAILED,
//         error: error
//     };
// };

// export const deleteRating = ( userId, postId, path ) => {
//     return {
//         type: actionTypes.DELETE_RATING,
//         userId: userId,
//         postId: postId,
//         path: path
//     };
// };

// export const deleteRatingFailed = (error) => {
//     return {
//         type: actionTypes.DELETE_RATING_FAILED,
//         error: error
//     };
// };

// MESSAGE MEMBER

export const removeMessageMember = ( memberId, path ) => {
    return {
        type: actionTypes.REMOVE_MESSAGE_MEMBER,
        memberId: memberId,
        path: path,
    };
};

export const removeMessageMemberFailed = (error) => {
    return {
        type: actionTypes.REMOVE_MESSAGE_MEMBER_FAILED,
        error: error
    };
};

// UTILITY

export const setNoRefreshFlag = (flag) => {
    return {
        type: actionTypes.SET_NO_REFRESH_FLAG,
        flag: flag
    };
};

export const setMessageSidebarState = (state) => {
    return {
        type: actionTypes.SET_MESSAGE_SIDEBAR_STATE,
        state: state
    };
};

export const populateNewData = (flag) => {
    return {
        type: actionTypes.POPULATE_NEW_DATA,
        flag: flag
    };
};

export const populateNewDataReady = () => {
    return {
        type: actionTypes.POPULATE_NEW_DATA_READY
    };
};