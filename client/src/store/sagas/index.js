import { takeEvery} from "redux-saga/effects";

import * as actionTypes from "../actions/actionTypes";
import {
  initCategoryDataSaga,
  initSubCategoryPageDataSaga,
  initThreadDataSaga,
  refreshCategoryDataSaga,
  refreshSubCategoryPageDataSaga,
  refreshThreadDataSaga,
  createCategorySaga,
  createSubCategorySaga,
  createThreadSaga,
  createPostSaga
} from "./forums";

export function* watchForums() {
  yield takeEvery(actionTypes.INIT_CATEGORY_DATA, initCategoryDataSaga);
  yield takeEvery(actionTypes.INIT_SUB_CATEGORY_PAGE_DATA, initSubCategoryPageDataSaga);
  yield takeEvery(actionTypes.INIT_THREAD_DATA, initThreadDataSaga);
  yield takeEvery(actionTypes.REFRESH_CATEGORY_DATA, refreshCategoryDataSaga);
  yield takeEvery(actionTypes.REFRESH_SUB_CATEGORY_PAGE_DATA, refreshSubCategoryPageDataSaga);
  yield takeEvery(actionTypes.REFRESH_THREAD_DATA, refreshThreadDataSaga);
  yield takeEvery(actionTypes.CREATE_CATEGORY, createCategorySaga);
  yield takeEvery(actionTypes.CREATE_SUB_CATEGORY, createSubCategorySaga);
  yield takeEvery(actionTypes.CREATE_THREAD, createThreadSaga);
  yield takeEvery(actionTypes.CREATE_POST, createPostSaga);
}