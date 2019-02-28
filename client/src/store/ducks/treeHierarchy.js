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

export const fetchExtraTreeHierarchyDataBegin = (categoryId, subcategoryId, fullAncestry) => ({type: FETCH_EXTRA_TREE_HIERARCHY_DATA_BEGIN, categoryId, subcategoryId, fullAncestry});
export const fetchExtraTreeHierarchyDataSuccess = (result, componentType, id, fullAncestry) => ({
    type: FETCH_EXTRA_TREE_HIERARCHY_DATA_SUCCESS, result, componentType, id, fullAncestry
});
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

const recursiveSubcatCreate = (ancestorArray, ancestorArrayPlace, currentSubcatChildren, result) => {
    let newSubcatChildren = currentSubcatChildren.map(subcat => {
        if(subcat.subcategoryId === ancestorArray[ancestorArrayPlace]){
            ancestorArrayPlace++;
            return {
                ...subcat,
                subcatChildren: ancestorArray.length === ancestorArrayPlace ? result.subcatChildren : recursiveSubcatCreate(ancestorArray, ancestorArrayPlace, subcat.subcatChildren, result),
                subcatChildren: ancestorArray.length === ancestorArrayPlace ? result.threadChildren : subcat.threadChildren,
                expanded: true,
                loaded: true
            }
        }else{
            return subcat;
        }
    })
    return newSubcatChildren;
};

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
            let ancestors = action.fullAncestry.split("/");
            ancestors.pop();
            ancestors.shift();
            ancestors.reverse();
            ancestors.push(action.id);
            let newTree = state.tree.map(cat => {
                if(cat.categoryId === ancestors[0]){
                    return {
                        ...cat,
                        subcatChildren: ancestors.length === 1 ? action.result.subcatChildren : recursiveSubcatCreate(ancestors, 1, cat.subcatChildren, action.result),
                        expanded: true,
                        loaded: true
                    }
                }else{
                    return cat;
                }
            })
            updatedState = {
                ...state,
                tree: newTree,
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
        const type = action.categoryId ? 1 : 2;
        const id = action.categoryId || action.subcategoryId;
        const response = yield axios.get(
            "/api/forums/treesingle/" + type + "/" + id
        );
        yield put(fetchTreeHierarchyDataSuccess(response.data, type, id, action.fullAncestry));
    } catch (error) {
        yield put(fetchTreeHierarchyDataFailed(error.response.data));
    }
}

export function* watchTreeHierarchy() {
    yield takeEvery(FETCH_TREE_HIERARCHY_DATA_BEGIN, fetchTreeHierarchyDataSaga);
    yield takeEvery(FETCH_EXTRA_TREE_HIERARCHY_DATA_BEGIN, fetchExtraTreeHierarchyDataSaga);
}

export default reducer;