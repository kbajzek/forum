import { put, takeEvery, take, select } from "redux-saga/effects";
import axios from "../../axios-forums";

import * as actions from '../actions/forums';
import * as actionTypes from '../actions/actionTypes';

// Action Types

export const FETCH_THREAD_DATA_BEGIN = 'FETCH_THREAD_DATA_BEGIN';
export const FETCH_THREAD_DATA_SUCCESS = 'FETCH_THREAD_DATA_SUCCESS';
export const FETCH_THREAD_DATA_FAILED = 'FETCH_THREAD_DATA_FAILED';
export const FETCH_THREAD_DATA_DISMISS_ERROR = 'FETCH_THREAD_DISMISS_ERROR';

export const CREATE_THREAD_BEGIN = 'CREATE_THREAD_BEGIN';
export const CREATE_THREAD_SUCCESS = 'CREATE_THREAD_SUCCESS';
export const CREATE_THREAD_FAILED = 'CREATE_THREAD_FAILED';
export const CREATE_THREAD_DISMISS_ERROR = 'CREATE_THREAD_DISMISS_ERROR';

export const CREATE_POST_BEGIN = 'CREATE_POST_BEGIN';
export const CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS';
export const CREATE_POST_FAILED = 'CREATE_POST_FAILED';
export const CREATE_POST_DISMISS_ERROR = 'CREATE_POST_DISMISS_ERROR';

export const EDIT_POST_BEGIN = 'EDIT_POST_BEGIN';
export const EDIT_POST_SUCCESS = 'EDIT_POST_SUCCESS';
export const EDIT_POST_FAILED = 'EDIT_POST_FAILED';
export const EDIT_POST_DISMISS_ERROR = 'EDIT_POST_DISMISS_ERROR';

export const DELETE_POST_BEGIN = 'DELETE_POST_BEGIN';
export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS';
export const DELETE_POST_FAILED = 'DELETE_POST_FAILED';
export const DELETE_POST_DISMISS_ERROR = 'DELETE_POST_DISMISS_ERROR';

export const CREATE_RATING_BEGIN = 'CREATE_RATING_BEGIN';
export const CREATE_RATING_SUCCESS = 'CREATE_RATING_SUCCESS';
export const CREATE_RATING_FAILED = 'CREATE_RATING_FAILED';
export const CREATE_RATING_DISMISS_ERROR = 'CREATE_RATING_DISMISS_ERROR';

export const DELETE_RATING_BEGIN = 'DELETE_RATING_BEGIN';
export const DELETE_RATING_SUCCESS = 'DELETE_RATING_SUCCESS';
export const DELETE_RATING_FAILED = 'DELETE_RATING_FAILED';
export const DELETE_RATING_DISMISS_ERROR = 'DELETE_RATING_DISMISS_ERROR';

// Actions

export const fetchThreadDataBegin = (threadId, clearFirst) => ({type: FETCH_THREAD_DATA_BEGIN, threadId, clearFirst});
export const fetchThreadDataSuccess = (result) => ({type: FETCH_THREAD_DATA_SUCCESS, result});
export const fetchThreadDataFailed = (error) => ({type: FETCH_THREAD_DATA_FAILED, error});
export const fetchThreadDataDismissError = () => ({type: FETCH_THREAD_DATA_DISMISS_ERROR});

export const createThreadBegin = (name, content, subCategoryId, history) => ({type: CREATE_THREAD_BEGIN, name, content, subCategoryId, history});
export const createThreadSuccess = (result) => ({type: CREATE_THREAD_SUCCESS, result});
export const createThreadFailed = (error) => ({type: CREATE_THREAD_FAILED, error});
export const createThreadDismissError = () => ({type: CREATE_THREAD_DISMISS_ERROR});

export const createPostBegin = (content, threadId, history, location) => ({type: CREATE_POST_BEGIN, content, threadId, history, location});
export const createPostSuccess = (result) => ({type: CREATE_POST_SUCCESS, result});
export const createPostFailed = (error) => ({type: CREATE_POST_FAILED, error});
export const createPostDismissError = () => ({type: CREATE_POST_DISMISS_ERROR});

export const editPostBegin = (content, postId, history, location) => ({type: EDIT_POST_BEGIN, content, postId, history, location});
export const editPostSuccess = (result) => ({type: EDIT_POST_SUCCESS, result});
export const editPostFailed = (error) => ({type: EDIT_POST_FAILED, error});
export const editPostDismissError = () => ({type: EDIT_POST_DISMISS_ERROR});

export const deletePostBegin = (postId, history) => ({type: DELETE_POST_BEGIN, postId, history});
export const deletePostSuccess = (result) => ({type: DELETE_POST_SUCCESS, result});
export const deletePostFailed = (error) => ({type: DELETE_POST_FAILED, error});
export const deletePostDismissError = () => ({type: DELETE_POST_DISMISS_ERROR});

export const createRatingBegin = (ratingTypeId, postId) => ({type: CREATE_RATING_BEGIN, ratingTypeId, postId});
export const createRatingSuccess = (result) => ({type: CREATE_RATING_SUCCESS, result});
export const createRatingFailed = (error) => ({type: CREATE_RATING_FAILED, error});
export const createRatingDismissError = () => ({type: CREATE_RATING_DISMISS_ERROR});

export const deleteRatingBegin = (ratingId) => ({type: DELETE_RATING_BEGIN, ratingId});
export const deleteRatingSuccess = (result) => ({type: DELETE_RATING_SUCCESS, result});
export const deleteRatingFailed = (error) => ({type: DELETE_RATING_FAILED, error});
export const deleteRatingDismissError = () => ({type: DELETE_RATING_DISMISS_ERROR});

// Selectors

export const getThreadId = (threadData) => {
    return threadData.id
}

export const getThreadName = (threadData) => {
    return threadData.name
}

export const getThreadSlug = (threadData) => {
    return threadData.slug
}

export const getThreadPosts = (threadData) => {
    return threadData.posts
}

export const getThreadRatingTypes = (threadData) => {
    return threadData.ratingTypes
}

export const getThreadLoading = (threadData) => {
    return threadData.loading
}

export const getThreadLoaded = (threadData) => {
    return threadData.loaded
}

export const getThreadErrors = (threadData) => {
    return threadData.errors
}

// Reducer

const initialState = {
    id: null,
    name: null,
    slug: null,
    posts: null,
    ratingTypes: null,
    path: null,
    loading: false,
    loaded: false,
    errors: []
};

const reducer = ( state = initialState, action ) => {

    let updatedState;

    switch ( action.type ) {

        case FETCH_THREAD_DATA_BEGIN: 
            updatedState = {
                ...state,
                loading: true,
                errors: []
            }
            return updatedState;
        case FETCH_THREAD_DATA_SUCCESS: 
            updatedState = {
                ...state,
                loading: false,
                loaded: true,
                ...action.result,
                errors: []
            }
            return updatedState;
        case FETCH_THREAD_DATA_FAILED: 
            updatedState = {
                ...state,
                loading: false,
                errors: [...state.error, action.error]
            }
            return updatedState;
        case FETCH_THREAD_DATA_DISMISS_ERROR:
            updatedState = {
                ...state,
                errors: []
            }
            return updatedState;


        case CREATE_THREAD_BEGIN: 
            updatedState = {
                ...state,
                loading: true,
                errors: []
            }
            return updatedState;
        case CREATE_THREAD_SUCCESS: 
            updatedState = {
                ...state,
                loading: false,
                loaded: true,
                errors: []
            }
            return updatedState;
        case CREATE_THREAD_FAILED: 
            updatedState = {
                ...state,
                loading: false,
                errors: [...state.error, action.error]
            }
            return updatedState;
        case CREATE_THREAD_DISMISS_ERROR:
            updatedState = {
                ...state,
                errors: []
            }
            return updatedState;


        case CREATE_POST_BEGIN: 
            updatedState = {
                ...state,
                loading: true,
                errors: []
            }
            return updatedState;
        case CREATE_POST_SUCCESS: 
            updatedState = {
                ...state,
                loading: false,
                loaded: true,
                errors: []
            }
            return updatedState;
        case CREATE_POST_FAILED: 
            updatedState = {
                ...state,
                loading: false,
                errors: [...state.error, action.error]
            }
            return updatedState;
        case CREATE_POST_DISMISS_ERROR:
            updatedState = {
                ...state,
                errors: []
            }
            return updatedState;


        case EDIT_POST_BEGIN: 
            updatedState = {
                ...state,
                loading: true,
                errors: []
            }
            return updatedState;
        case EDIT_POST_SUCCESS: 
            updatedState = {
                ...state,
                loading: false,
                loaded: true,
                errors: []
            }
            return updatedState;
        case EDIT_POST_FAILED: 
            updatedState = {
                ...state,
                loading: false,
                errors: [...state.error, action.error]
            }
            return updatedState;
        case EDIT_POST_DISMISS_ERROR:
            updatedState = {
                ...state,
                errors: []
            }
            return updatedState;


        case DELETE_POST_BEGIN: 
            updatedState = {
                ...state,
                loading: true,
                errors: []
            }
            return updatedState;
        case DELETE_POST_SUCCESS: 
            updatedState = {
                ...state,
                loading: false,
                loaded: true,
                errors: []
            }
            return updatedState;
        case DELETE_POST_FAILED: 
            updatedState = {
                ...state,
                loading: false,
                errors: [...state.error, action.error]
            }
            return updatedState;
        case DELETE_POST_DISMISS_ERROR:
            updatedState = {
                ...state,
                errors: []
            }
            return updatedState;


        case CREATE_RATING_BEGIN: 
            updatedState = {
                ...state,
                loading: true,
                errors: []
            }
            return updatedState;
        case CREATE_RATING_SUCCESS: 
            updatedState = {
                ...state,
                loading: false,
                loaded: true,
                errors: []
            }
            return updatedState;
        case CREATE_RATING_FAILED: 
            updatedState = {
                ...state,
                loading: false,
                errors: [...state.error, action.error]
            }
            return updatedState;
        case CREATE_RATING_DISMISS_ERROR:
            updatedState = {
                ...state,
                errors: []
            }
            return updatedState;


        case DELETE_RATING_BEGIN: 
            updatedState = {
                ...state,
                loading: true,
                errors: []
            }
            return updatedState;
        case DELETE_RATING_SUCCESS: 
            updatedState = {
                ...state,
                loading: false,
                loaded: true,
                errors: []
            }
            return updatedState;
        case DELETE_RATING_FAILED: 
            updatedState = {
                ...state,
                loading: false,
                errors: [...state.error, action.error]
            }
            return updatedState;
        case DELETE_RATING_DISMISS_ERROR:
            updatedState = {
                ...state,
                errors: []
            }
            return updatedState;


        default: return state;
    }
};

export function* fetchThreadDataSaga(action) {
    try {
        if(action.clearFirst){
            yield put(fetchThreadDataSuccess({
                id: null,
                name: null,
                slug: null,
                posts: null,
                ratingTypes: null,
                path: null,
                loaded: false,
            }));
        }
        const response = yield axios.get(
            "/api/forums/thread/" + action.threadId
        );
        const state = yield select();
        if(state.forums.populateNewData){
            yield take(actionTypes.POPULATE_NEW_DATA_READY);
        }
        yield put(fetchThreadDataSuccess(response.data));
    } catch (error) {
        yield put(fetchThreadDataFailed(error.response.data));
    }
}

export function* createThreadSaga(action) {
    try {
        const response = yield axios.post(
            "/api/forums/thread/create", {
                name: action.name,
                content: action.content,
                subCategoryId: action.subCategoryId
            }
        );
        yield put(createThreadSuccess());
        yield action.history.push("/forums" + response.data.path);
    } catch (error) {
        yield put(createThreadFailed(error.response.data));
    }
}

export function* createPostSaga(action) {
    try {
        const response = yield axios.post(
            "/api/forums/post/create", {
                content: action.content,
                threadId: action.threadId
            }
        );
        yield put(createPostSuccess());
        if(action.location.pathname === "/forums" + response.data.path){
            yield put(fetchThreadDataBegin(response.data.threadId));
        }
        yield action.history.push("/forums" + response.data.path + response.data.hash);
    } catch (error) {
        yield put(createPostFailed(error.response.data));
    }
}
  
export function* editPostSaga(action) {
    try {
        const response = yield axios.post(
            "/api/forums/post/edit", {
                content: action.content,
                postId: action.postId
            }
        );
        yield put(editPostSuccess());
        if(action.location.pathname === "/forums" + response.data.path){
            yield put(fetchThreadDataBegin(response.data.threadId));
        }
        yield action.history.push("/forums" + response.data.path + response.data.hash);
    } catch (error) {
        yield put(editPostFailed(error.response.data));
    }
}
  
export function* deletePostSaga(action) {
    try {
        const response = yield axios.post(
            "/api/forums/post/delete", {
                postId: action.postId
            }
        );
        yield put(deletePostSuccess());
        if (response.data.response === 1) {
            yield action.history.replace("/forums");
        } else {
            yield put(fetchThreadDataBegin(response.data.threadId));
        }
    } catch (error) {
        yield put(deletePostFailed(error.response.data));
    }
}

export function* createRatingSaga(action) {
    try {
        const response = yield axios.post(
            "/api/forums/rating/create", {
                postId: action.postId,
                ratingTypeId: action.ratingTypeId
            }
        );
        yield put(createRatingSuccess());
        yield put(fetchThreadDataBegin(response.data.threadId));
    } catch (error) {
        yield put(createRatingFailed(error.response.data));
    }
}
  
export function* deleteRatingSaga(action) {
    try {
        const response = yield axios.post(
            "/api/forums/rating/delete", {
                ratingId: action.ratingId
            }
        );
        yield put(deleteRatingSuccess());
        yield put(fetchThreadDataBegin(response.data.threadId));
    } catch (error) {
        yield put(deleteRatingFailed(error.response.data));
    }
}

export function* watchThread() {
    yield takeEvery(FETCH_THREAD_DATA_BEGIN, fetchThreadDataSaga);
    yield takeEvery(CREATE_THREAD_BEGIN, createThreadSaga);
    yield takeEvery(CREATE_POST_BEGIN, createPostSaga);
    yield takeEvery(EDIT_POST_BEGIN, editPostSaga);
    yield takeEvery(DELETE_POST_BEGIN, deletePostSaga);
    yield takeEvery(CREATE_RATING_BEGIN, createRatingSaga);
    yield takeEvery(DELETE_RATING_BEGIN, deleteRatingSaga);
}

export default reducer;