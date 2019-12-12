import { put, takeEvery } from "redux-saga/effects";
import axios from "../../axios-forums";

// import * as actions from '../actions/forums';
// import * as actionTypes from '../actions/actionTypes';

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

export const fetchExtraTreeHierarchyDataBegin = (categoryId, subcategoryId, fullAncestry, expanded, loaded) => {
    const componentType = categoryId ? 1 : 2;
    const id = categoryId || subcategoryId;
    return {type: FETCH_EXTRA_TREE_HIERARCHY_DATA_BEGIN, componentType, id, fullAncestry, expanded, loaded};
};
export const fetchExtraTreeHierarchyDataSuccess = (result, componentType, id, fullAncestry, expanded, loaded) => ({
    type: FETCH_EXTRA_TREE_HIERARCHY_DATA_SUCCESS, result, componentType, id, fullAncestry, expanded, loaded
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

const recursiveSubcatCreate = (ancestorArray, ancestorArrayPlace, currentSubcatChildren, result, loaded, expanded, setLoading) => {
    let newSubcatChildren = currentSubcatChildren.map(subcat => {
        if(subcat.subcategoryId === ancestorArray[ancestorArrayPlace]){
            ancestorArrayPlace++;
            let updatedSubcatChildren;
            let updatedThreadChildren;
            let updatedExpanded;
            let updatedLoading;
            let updatedLoaded;
            if(setLoading){
                updatedSubcatChildren = ancestorArray.length === ancestorArrayPlace 
                    ? subcat.subcatChildren
                    : recursiveSubcatCreate(ancestorArray, ancestorArrayPlace, subcat.subcatChildren, result, loaded, expanded, setLoading);
                updatedThreadChildren = subcat.threadChildren;
                updatedExpanded = subcat.expanded;
                updatedLoading = ancestorArray.length === ancestorArrayPlace ? true : subcat.loading;
                updatedLoaded = subcat.loaded;
            }else{
                updatedSubcatChildren = ancestorArray.length === ancestorArrayPlace 
                    ? (loaded 
                        ? subcat.subcatChildren 
                        : result.subcatChildren) 
                    : recursiveSubcatCreate(ancestorArray, ancestorArrayPlace, subcat.subcatChildren, result, loaded, expanded, setLoading);
                updatedThreadChildren = ancestorArray.length === ancestorArrayPlace 
                    ? (loaded
                        ? subcat.threadChildren
                        : result.threadChildren)
                    : subcat.threadChildren;
                updatedExpanded = ancestorArray.length === ancestorArrayPlace ? !expanded : subcat.expanded;
                updatedLoading = false;
                updatedLoaded = true;
            }
            let newSubcat = {
                ...subcat,
                subcatChildren: updatedSubcatChildren,
                threadChildren: updatedThreadChildren,
                expanded: updatedExpanded,
                loading: updatedLoading,
                loaded: updatedLoaded,
            }
            return newSubcat;
        }else{
            return subcat;
        }
    });
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
    let ancestors;
    let newTree;

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
            ancestors = null;
            if(action.componentType === 2){ //1 = category, 2 = subcategory
                ancestors = action.fullAncestry.split("/");
                ancestors.pop();
                ancestors.shift();
                ancestors.reverse();
                ancestors = ancestors.map(elt => parseInt(elt));
                ancestors.push(action.id);
            }
            newTree = state.tree.map(cat => {
                if((action.componentType === 1 && cat.categoryId === action.id) || (action.componentType === 2 && cat.categoryId === ancestors[0])){
                    return {
                        ...cat,
                        subcatChildren: action.componentType === 1 
                        ? cat.subcatChildren
                        : recursiveSubcatCreate(ancestors, 1, cat.subcatChildren, action.result, action.loaded, action.expanded, true),
                        loading: action.componentType === 1 ? true : cat.loading,
                    }
                }else{
                    return cat;
                }
            })
            updatedState = {
                ...state,
                tree: newTree
            }
            return updatedState;
        case FETCH_EXTRA_TREE_HIERARCHY_DATA_SUCCESS: 
            ancestors = null;
            if(action.componentType === 2){ //1 = category, 2 = subcategory
                ancestors = action.fullAncestry.split("/");
                ancestors.pop();
                ancestors.shift();
                ancestors.reverse();
                ancestors = ancestors.map(elt => parseInt(elt));
                ancestors.push(action.id);
            }
            newTree = state.tree.map(cat => {
                if((action.componentType === 1 && cat.categoryId === action.id) || (action.componentType === 2 && cat.categoryId === ancestors[0])){
                    return {
                        ...cat,
                        subcatChildren: action.componentType === 1 
                        ? (action.loaded 
                            ? cat.subcatChildren 
                            : action.result.subcatChildren) 
                        : recursiveSubcatCreate(ancestors, 1, cat.subcatChildren, action.result, action.loaded, action.expanded),
                        expanded: action.componentType === 1 ? !action.expanded : true,
                        loading: false,
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
        let result;
        if(!action.loaded){
            const response = yield axios.get(
                "/api/forums/treesingle/" + action.componentType + "/" + action.id
            );
            result = response.data;
        }
        yield put(fetchExtraTreeHierarchyDataSuccess(result, action.componentType, action.id, action.fullAncestry, action.expanded, action.loaded));
    } catch (error) {
        yield put(fetchExtraTreeHierarchyDataFailed(error.response.data));
    }
}

export function* watchTreeHierarchy() {
    yield takeEvery(FETCH_TREE_HIERARCHY_DATA_BEGIN, fetchTreeHierarchyDataSaga);
    yield takeEvery(FETCH_EXTRA_TREE_HIERARCHY_DATA_BEGIN, fetchExtraTreeHierarchyDataSaga);
}

export default reducer;