import { put, takeEvery, take, select } from "redux-saga/effects";
import axios from "../../axios-forums";

import * as actions from '../actions/forums';
import * as actionTypes from '../actions/actionTypes';

// Action Types

export const FETCH_CATEGORY_DATA_BEGIN = 'FETCH_CATEGORY_DATA_BEGIN';
export const FETCH_CATEGORY_DATA_SUCCESS = 'FETCH_CATEGORY_DATA_SUCCESS';
export const FETCH_CATEGORY_DATA_FAILED = 'FETCH_CATEGORY_DATA_FAILED';
export const FETCH_CATEGORY_DATA_DISMISS_ERROR = 'FETCH_CATEGORY_DISMISS_ERROR';

export const CREATE_CATEGORY_BEGIN = 'CREATE_CATEGORY_BEGIN';
export const CREATE_CATEGORY_SUCCESS = 'CREATE_CATEGORY_SUCCESS';
export const CREATE_CATEGORY_FAILED = 'CREATE_CATEGORY_FAILED';
export const CREATE_CATEGORY_DISMISS_ERROR = 'CREATE_CATEGORY_DISMISS_ERROR';

// Actions

export const fetchCategoryDataBegin = () => ({type: FETCH_CATEGORY_DATA_BEGIN});
export const fetchCategoryDataSuccess = (result) => ({type: FETCH_CATEGORY_DATA_SUCCESS, result});
export const fetchCategoryDataFailed = (error) => ({type: FETCH_CATEGORY_DATA_FAILED, error});
export const fetchCategoryDataDismissError = () => ({type: FETCH_CATEGORY_DATA_DISMISS_ERROR});

export const createCategoryBegin = (name) => ({type: CREATE_CATEGORY_BEGIN, name});
export const createCategorySuccess = (result) => ({type: CREATE_CATEGORY_SUCCESS, result});
export const createCategoryFailed = (error) => ({type: CREATE_CATEGORY_FAILED, error});
export const createCategoryDismissError = () => ({type: CREATE_CATEGORY_DISMISS_ERROR});

// Selectors

export const getCategoryCategories = (categoryData) => {
    return categoryData.categories
}

export const getCategoryLoading = (categoryData) => {
    return categoryData.loading
}

export const getCategoryLoaded = (categoryData) => {
    return categoryData.loaded
}

export const getCategoryErrors = (categoryData) => {
    return categoryData.errors
}

// Reducer

const initialState = {
    categories: null,
    loading: false,
    loaded: false,
    errors: []
};

const reducer = ( state = initialState, action ) => {

    let updatedState;

    switch ( action.type ) {

        case FETCH_CATEGORY_DATA_BEGIN: 
            updatedState = {
                ...state,
                loading: true,
                errors: []
            }
            return updatedState;
        case FETCH_CATEGORY_DATA_SUCCESS: 
            updatedState = {
                ...state,
                ...action.result,
                loading: false,
                loaded: true,
                errors: []
            }
            return updatedState;
        case FETCH_CATEGORY_DATA_FAILED: 
            updatedState = {
                ...state,
                loading: false,
                errors: [...state.error, action.error]
            }
            return updatedState;
        case FETCH_CATEGORY_DATA_DISMISS_ERROR:
            updatedState = {
                ...state,
                errors: []
            }
            return updatedState;
        case CREATE_CATEGORY_BEGIN: 
            updatedState = {
                ...state,
                loading: true,
                errors: []
            }
            return updatedState;
        case CREATE_CATEGORY_SUCCESS: 
            updatedState = {
                ...state,
                loading: false,
                loaded: true,
                errors: []
            }
            return updatedState;
        case CREATE_CATEGORY_FAILED: 
            updatedState = {
                ...state,
                loading: false,
                errors: [...state.error, action.error]
            }
            return updatedState;
        case CREATE_CATEGORY_DISMISS_ERROR:
            updatedState = {
                ...state,
                errors: []
            }
            return updatedState;
        default: return state;
    }
};

export function* fetchCategoryDataSaga() {
    try {
        const response = yield axios.get(
            "/api/forums"
        );
        const state = yield select();
        if(state.forums.populateNewData){
            yield take(actionTypes.POPULATE_NEW_DATA_READY);
        }
        yield put(fetchCategoryDataSuccess(response.data));
    } catch (error) {
        yield put(fetchCategoryDataFailed(error.response.data));
    }
}

export function* createCategorySaga(action) {
    try {
        yield axios.post(
            "/api/forums/category/create", {
                name: action.name
            }
        );
        yield put(createCategorySuccess());
        yield put(fetchCategoryDataBegin());
    } catch (error) {
        yield put(createCategoryFailed(error.response.data));
    }
}

export function* watchCategory() {
    yield takeEvery(FETCH_CATEGORY_DATA_BEGIN, fetchCategoryDataSaga);
    yield takeEvery(CREATE_CATEGORY_BEGIN, createCategorySaga);
}

export default reducer;