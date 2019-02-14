import { put, takeEvery, take, select } from "redux-saga/effects";
import axios from "../../axios-forums";

import * as categoryActions from './category';

import * as actions from '../actions/forums';
import * as actionTypes from '../actions/actionTypes';

// Action Types

export const FETCH_SUBCATEGORY_DATA_BEGIN = 'FETCH_SUBCATEGORY_DATA_BEGIN';
export const FETCH_SUBCATEGORY_DATA_SUCCESS = 'FETCH_SUBCATEGORY_DATA_SUCCESS';
export const FETCH_SUBCATEGORY_DATA_FAILED = 'FETCH_SUBCATEGORY_DATA_FAILED';
export const FETCH_SUBCATEGORY_DATA_DISMISS_ERROR = 'FETCH_SUBCATEGORY_DISMISS_ERROR';

export const CREATE_SUBCATEGORY_BEGIN = 'CREATE_SUBCATEGORY_BEGIN';
export const CREATE_SUBCATEGORY_SUCCESS = 'CREATE_SUBCATEGORY_SUCCESS';
export const CREATE_SUBCATEGORY_FAILED = 'CREATE_SUBCATEGORY_FAILED';
export const CREATE_SUBCATEGORY_DISMISS_ERROR = 'CREATE_SUBCATEGORY_DISMISS_ERROR';

export const SET_SUBCATEGORY_USERS_VIEWING = 'SET_SUBCATEGORY_USERS_VIEWING';

// Actions

export const fetchSubCategoryDataBegin = (subCategoryId) => ({type: FETCH_SUBCATEGORY_DATA_BEGIN, subCategoryId});
export const fetchSubCategoryDataSuccess = (result) => ({type: FETCH_SUBCATEGORY_DATA_SUCCESS, result});
export const fetchSubCategoryDataFailed = (error) => ({type: FETCH_SUBCATEGORY_DATA_FAILED, error});
export const fetchSubCategoryDataDismissError = () => ({type: FETCH_SUBCATEGORY_DATA_DISMISS_ERROR});

export const createSubCategoryBegin = (name, description, categoryId, subCategoryId) => ({type: CREATE_SUBCATEGORY_BEGIN, name, description, categoryId, subCategoryId});
export const createSubCategorySuccess = (result) => ({type: CREATE_SUBCATEGORY_SUCCESS, result});
export const createSubCategoryFailed = (error) => ({type: CREATE_SUBCATEGORY_FAILED, error});
export const createSubCategoryDismissError = () => ({type: CREATE_SUBCATEGORY_DISMISS_ERROR});

export const setSubCategoryUsersViewing = (users) => ({type: SET_SUBCATEGORY_USERS_VIEWING, users});

// Selectors

export const getSubCategoryName = (subCategoryData) => {
    return subCategoryData.name
}

export const getSubCategoryId = (subCategoryData) => {
    return subCategoryData.id
}

export const getSubCategorySubCategories = (subCategoryData) => {
    return subCategoryData.subCategories
}

export const getSubCategoryThreads = (subCategoryData) => {
    return subCategoryData.threads
}

export const getSubCategoryLoading = (subCategoryData) => {
    return subCategoryData.loading
}

export const getSubCategoryLoaded = (subCategoryData) => {
    return subCategoryData.loaded
}

export const getSubCategoryErrors = (subCategoryData) => {
    return subCategoryData.errors
}

// Reducer

const initialState = {
    id: null,
    name: null,
    slug: null,
    subCategories: null,
    threads: null,
    path: null,
    loading: false,
    loaded: false,
    usersViewing: [],
    errors: []
};

const reducer = ( state = initialState, action ) => {

    let updatedState;

    switch ( action.type ) {

        case FETCH_SUBCATEGORY_DATA_BEGIN: 
            updatedState = {
                ...state,
                loading: true,
                errors: []
            }
            return updatedState;
        case FETCH_SUBCATEGORY_DATA_SUCCESS: 
            updatedState = {
                ...state,
                ...action.result,
                loading: false,
                loaded: true,
                errors: []
            }
            return updatedState;
        case FETCH_SUBCATEGORY_DATA_FAILED: 
            updatedState = {
                ...state,
                loading: false,
                errors: [...state.error, action.error]
            }
            return updatedState;
        case FETCH_SUBCATEGORY_DATA_DISMISS_ERROR:
            updatedState = {
                ...state,
                errors: []
            }
            return updatedState;
        case CREATE_SUBCATEGORY_BEGIN: 
            updatedState = {
                ...state,
                loading: true,
                errors: []
            }
            return updatedState;
        case CREATE_SUBCATEGORY_SUCCESS: 
            updatedState = {
                ...state,
                loading: false,
                loaded: true,
                errors: []
            }
            return updatedState;
        case CREATE_SUBCATEGORY_FAILED: 
            updatedState = {
                ...state,
                loading: false,
                errors: [...state.error, action.error]
            }
            return updatedState;
        case CREATE_SUBCATEGORY_DISMISS_ERROR:
            updatedState = {
                ...state,
                errors: []
            }
            return updatedState;
        case SET_SUBCATEGORY_USERS_VIEWING:
            updatedState = {
                ...state,
                usersViewing: action.users
            }
            return updatedState;
        default: return state;
    }
};

export function* fetchSubCategoryDataSaga(action) {
    try {
        const response = yield axios.get(
            "/api/forums/subcategory/" + action.subCategoryId
        );
        const state = yield select();
        if(state.forums.waitOnExitingPage){
            yield take(actionTypes.WAIT_ON_EXITING_PAGE);
        }
        yield put(fetchSubCategoryDataSuccess(response.data));
        yield put(actions.hidePage(false));
    } catch (error) {
        yield put(fetchSubCategoryDataFailed(error.response.data));
        yield put(actions.hidePage(false));
    }
}

export function* createSubCategorySaga(action) {
    try {
      const response = yield axios.post(
        "/api/forums/subcategory/create", {
          name: action.name,
          description: action.description,
          categoryId: action.categoryId,
          subcategoryId: action.subCategoryId
        }
      );
      yield put(createSubCategorySuccess());
      if (action.categoryId) {
        yield put(categoryActions.fetchCategoryDataBegin());
      } else {
        yield put(fetchSubCategoryDataBegin(action.subCategoryId));
      }
    } catch (error) {
      yield put(createSubCategoryFailed(error.response.data));
    }
  }

export function* watchSubCategory() {
    yield takeEvery(FETCH_SUBCATEGORY_DATA_BEGIN, fetchSubCategoryDataSaga);
    yield takeEvery(CREATE_SUBCATEGORY_BEGIN, createSubCategorySaga);
}

export default reducer;