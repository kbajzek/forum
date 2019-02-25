import { put, takeEvery, take, select } from "redux-saga/effects";
import axios from "../../axios-forums";

import * as actions from '../actions/forums';
import * as actionTypes from '../actions/actionTypes';

// Action Types

export const FETCH_TREE_HIERARCHY_DATA_BEGIN = 'FETCH_TREE_HIERARCHY_DATA_BEGIN';
export const FETCH_TREE_HIERARCHY_DATA_SUCCESS = 'FETCH_TREE_HIERARCHY_DATA_SUCCESS';
export const FETCH_TREE_HIERARCHY_DATA_FAILED = 'FETCH_TREE_HIERARCHY_DATA_FAILED';
export const FETCH_TREE_HIERARCHY_DATA_DISMISS_ERROR = 'FETCH_TREE_HIERARCHY_DISMISS_ERROR';

export const FETCH_EXTRA_TREE_HIERARCHY_DATA_BEGIN = 'FETCH_EXTRA_TREE_HIERARCHY_DATA_BEGIN';
export const FETCH_EXTRA_TREE_HIERARCHY_DATA_SUCCESS = 'FETCH_EXTRA_TREE_HIERARCHY_DATA_SUCCESS';
export const FETCH_EXTRA_TREE_HIERARCHY_DATA_FAILED = 'FETCH_EXTRA_TREE_HIERARCHY_DATA_FAILED';
export const FETCH_EXTRA_TREE_HIERARCHY_DATA_DISMISS_ERROR = 'FETCH_EXTRA_TREE_HIERARCHY_DATA_DISMISS_ERROR';

// Actions

export const fetchTreeHierarchyDataBegin = (threadId) => ({type: FETCH_TREE_HIERARCHY_DATA_BEGIN, threadId});
export const fetchTreeHierarchyDataSuccess = (result) => ({type: FETCH_TREE_HIERARCHY_DATA_SUCCESS, result});
export const fetchTreeHierarchyDataFailed = (error) => ({type: FETCH_TREE_HIERARCHY_DATA_FAILED, error});
export const fetchTreeHierarchyDataDismissError = () => ({type: FETCH_TREE_HIERARCHY_DATA_DISMISS_ERROR});

export const fetchExtraTreeHierarchyDataBegin = (categoryId, subcategoryId) => ({type: FETCH_EXTRA_TREE_HIERARCHY_DATA_BEGIN, categoryId, subcategoryId});
export const fetchExtraTreeHierarchyDataSuccess = (result) => ({type: FETCH_EXTRA_TREE_HIERARCHY_DATA_SUCCESS, result});
export const fetchExtraTreeHierarchyDataFailed = (error) => ({type: FETCH_EXTRA_TREE_HIERARCHY_DATA_FAILED, error});
export const fetchExtraTreeHierarchyDataDismissError = () => ({type: FETCH_EXTRA_TREE_HIERARCHY_DATA_DISMISS_ERROR});

// Selectors

// export const getSubCategoryName = (subCategoryData) => {
//     return subCategoryData.name
// }

// export const getSubCategoryId = (subCategoryData) => {
//     return subCategoryData.id
// }

// export const getSubCategorySubCategories = (subCategoryData) => {
//     return subCategoryData.subCategories
// }

// export const getSubCategoryThreads = (subCategoryData) => {
//     return subCategoryData.threads
// }

// export const getSubCategoryLoading = (subCategoryData) => {
//     return subCategoryData.loading
// }

// export const getSubCategoryLoaded = (subCategoryData) => {
//     return subCategoryData.loaded
// }

// export const getSubCategoryErrors = (subCategoryData) => {
//     return subCategoryData.errors
// }

// Reducer

const initialState = {
    tree: [],
    loading: false,
    loaded: false,
    errors: []
};

const reducer = ( state = initialState, action ) => {

    let updatedState;

    switch ( action.type ) {

        case FETCH_TREE_HIERARCHY_DATA_BEGIN: 
            updatedState = {
                ...state,
                loading: true,
                errors: []
            }
            return updatedState;
        case FETCH_TREE_HIERARCHY_DATA_SUCCESS: 
            updatedState = {
                ...state,
                ...action.result,
                loading: false,
                loaded: true,
                errors: []
            }
            return updatedState;
        case FETCH_TREE_HIERARCHY_DATA_FAILED: 
            updatedState = {
                ...state,
                loading: false,
                errors: [...state.error, action.error]
            }
            return updatedState;
        case FETCH_TREE_HIERARCHY_DATA_DISMISS_ERROR:
            updatedState = {
                ...state,
                errors: []
            }
            return updatedState;
        case FETCH_EXTRA_TREE_HIERARCHY_DATA_BEGIN: 
            updatedState = {
                ...state,
                loading: true,
                errors: []
            }
            return updatedState;
        case FETCH_EXTRA_TREE_HIERARCHY_DATA_SUCCESS: 
            updatedState = {
                ...state,
                ...action.result,
                loading: false,
                loaded: true,
                errors: []
            }
            return updatedState;
        case FETCH_EXTRA_TREE_HIERARCHY_DATA_FAILED: 
            updatedState = {
                ...state,
                loading: false,
                errors: [...state.error, action.error]
            }
            return updatedState;
        case FETCH_EXTRA_TREE_HIERARCHY_DATA_DISMISS_ERROR:
            updatedState = {
                ...state,
                errors: []
            }
            return updatedState;
        default: return state;
    }
};

export function* fetchTreeHierarchyDataSaga(action) {
    try {
        const response = yield axios.get(
            "/api/forums/treelist/" + action.threadId
        );
        yield put(fetchTreeHierarchyDataSuccess(response.data));
    } catch (error) {
        yield put(fetchTreeHierarchyDataFailed(error.response.data));
    }
}

export function* fetchExtraTreeHierarchyDataSaga(action) {
    try {
        const response = yield axios.get(
            "/api/forums/treelist/" + action.threadId
        );
        yield put(fetchTreeHierarchyDataSuccess(response.data));
    } catch (error) {
        yield put(fetchTreeHierarchyDataFailed(error.response.data));
    }
}

export function* watchTreeHierarchy() {
    yield takeEvery(FETCH_TREE_HIERARCHY_DATA_BEGIN, fetchTreeHierarchyDataSaga);
    yield takeEvery(FETCH_EXTRA_TREE_HIERARCHY_DATA_BEGIN, fetchExtraTreeHierarchyDataSaga);
}

export default reducer;