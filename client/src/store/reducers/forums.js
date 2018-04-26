import * as actionTypes from '../actions/actionTypes';

const initialState = {
    categoryData: null,
    subCategoryPageData: null,
    threadData: null,
    postEditorData: null,
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

const refreshCategoryDataFailed = (state, action) => {
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

const refreshThreadDataFailed = (state, action) => {
    const updatedState = {
        ...state,
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

// const createSubCategorySuccessPartial = (state, action) => {

//     let updatedCategoryData = state.categoryData;
//     let updatedSubCategoryPageData = state.subCategoryPageData;

//     if (action.categoryId) {
//         updatedCategoryData = state.categoryData.map((category) => {
//             if (category.id === action.categoryId) {
//                 const updatedSubCategories = category.subCategories.concat(
//                     {
//                         id: action.id,
//                         path: action.path,
//                         name: action.name,
//                         description: action.description,
//                         totalPosts: 0,
//                         lastActiveThread: {
//                             name: 'none',
//                             user: 'none',
//                             lastUpdated: 'none',
//                             path: 'none'
//                         }
//                     }
//                 );
//                 return {
//                     ...category,
//                     subCategories: updatedSubCategories
//                 };
//             }
//             return category;
//         });

//     } else {

//         const updatedSubCategories = state.subCategoryPageData.subCategories.concat(
//             {
//                 id: action.id,
//                 path: action.path,
//                 name: action.name,
//                 description: action.description,
//                 totalPosts: 0,
//                 lastActiveThread: {
//                     name: 'none',
//                     user: 'none',
//                     lastUpdated: 'none',
//                     path: 'none'
//                 }
//             }
//         );

//         updatedSubCategoryPageData = {
//             ...state.subCategoryPageData,
//             subCategories: updatedSubCategories
//         }

//     }

//     const updatedState = {
//         ...state,
//         categoryData: updatedCategoryData,
//         subCategoryPageData: updatedSubCategoryPageData,
//         error: false
//     }
//     return updatedState;
// };

const createThreadFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};

// const createThreadSuccess = (state, action) => {

//     const updatedThreads = state.subCategoryPageData.threads.concat(
//         {
//             id: action.id,
//             path: action.path,
//             name: action.name,
//             creator: action.userName,
//             createdOn: action.createdOn,
//             totalReplies: 0,
//             totalViews: 0,
//             lastPost: {
//                 user: action.userName,
//                 lastUpdated: action.lastUpdated
//             }
//         }
//     );

//     const updatedSubCategoryPageData = {
//         ...state.subCategoryPageData,
//         threads: updatedThreads
//     }

//     const updatedState = {
//         ...state,
//         subCategoryPageData: updatedSubCategoryPageData,
//         error: false
//     }
//     return updatedState;
// };

const createPostFailed = (state, action) => {
    const updatedState = {
        ...state,
        error: action.error
    }
    return updatedState;
};

// const createPostSuccessPartial = (state, action) => {
//     const updatedPosts = state.threadData.posts.concat(
//         {
//             id: action.id,
//             content: action.content,
//             ratings: [],
//             creator: {
//                 name: action.userName,
//                 pictureURL: action.userPicture,
//                 totalPosts: action.userTotalPosts,
//                 signature: action.userSignature
//             }
//         }
//     );

//     const updatedThreadData = {
//         ...state.threadData,
//         posts: updatedPosts
//     }

//     const updatedState = {
//         ...state,
//         threadData: updatedThreadData,
//         error: false
//     }
//     return updatedState;
// };

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {

        case actionTypes.SET_CATEGORY_DATA: return setCategoryData(state, action);
        case actionTypes.INIT_CATEGORY_DATA_FAILED: return initCategoryDataFailed(state, action);
        case actionTypes.SET_SUB_CATEGORY_PAGE_DATA: return setSubCategoryPageData(state, action);
        case actionTypes.INIT_SUB_CATEGORY_PAGE_DATA_FAILED: return initSubCategoryPageDataFailed(state, action);
        case actionTypes.SET_THREAD_DATA: return setThreadData(state, action);
        case actionTypes.INIT_THREAD_DATA_FAILED: return initThreadDataFailed(state, action);
        
        case actionTypes.REFRESH_CATEGORY_DATA_FAILED: return refreshCategoryDataFailed(state, action);
        case actionTypes.REFRESH_SUB_CATEGORY_PAGE_DATA_FAILED: return refreshSubCategoryPageDataFailed(state, action);
        case actionTypes.REFRESH_THREAD_DATA_FAILED: return refreshThreadDataFailed(state, action);

        case actionTypes.CREATE_CATEGORY_FAILED: return createCategoryFailed(state, action);
        case actionTypes.CREATE_SUB_CATEGORY_FAILED: return createSubCategoryFailed(state, action);
        case actionTypes.CREATE_THREAD_FAILED: return createThreadFailed(state, action);
        case actionTypes.CREATE_POST_FAILED: return createPostFailed(state, action);

        default: return state;
    }
};

export default reducer;