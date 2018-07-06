import { takeEvery} from "redux-saga/effects";

import * as actionTypes from "../actions/actionTypes";
import {
  initCategoryDataSaga,
  refreshCategoryDataSaga,
  initSubCategoryPageDataSaga,
  refreshSubCategoryPageDataSaga,
  initThreadDataSaga,
  refreshThreadDataSaga,
  initUserDataSaga,
  refreshUserDataSaga,
  initMessageDataSaga,
  refreshMessageDataSaga,
  createCategorySaga,
  createSubCategorySaga,
  createThreadSaga,
  createPostSaga,
  editPostSaga,
  deletePostSaga,
  createMessageSaga,
  createMessagePostSaga,
  editMessagePostSaga,
  fetchUserlistSaga,
  deleteMessagePostSaga,
  createRatingSaga,
  deleteRatingSaga,
} from "./forums";
import {
  fetchUserSaga,
  logoutUserSaga,
} from "./auth";

export function* watchForums() {
  yield takeEvery(actionTypes.INIT_CATEGORY_DATA, initCategoryDataSaga);
  yield takeEvery(actionTypes.REFRESH_CATEGORY_DATA, refreshCategoryDataSaga);
  yield takeEvery(actionTypes.INIT_SUB_CATEGORY_PAGE_DATA, initSubCategoryPageDataSaga);
  yield takeEvery(actionTypes.REFRESH_SUB_CATEGORY_PAGE_DATA, refreshSubCategoryPageDataSaga);
  yield takeEvery(actionTypes.INIT_THREAD_DATA, initThreadDataSaga);
  yield takeEvery(actionTypes.REFRESH_THREAD_DATA, refreshThreadDataSaga);
  yield takeEvery(actionTypes.INIT_USER_DATA, initUserDataSaga);
  yield takeEvery(actionTypes.REFRESH_USER_DATA, refreshUserDataSaga);
  yield takeEvery(actionTypes.INIT_MESSAGE_DATA, initMessageDataSaga);
  yield takeEvery(actionTypes.REFRESH_MESSAGE_DATA, refreshMessageDataSaga);
  yield takeEvery(actionTypes.FETCH_USERLIST_INIT, fetchUserlistSaga);
  yield takeEvery(actionTypes.CREATE_CATEGORY, createCategorySaga);
  yield takeEvery(actionTypes.CREATE_SUB_CATEGORY, createSubCategorySaga);
  yield takeEvery(actionTypes.CREATE_THREAD, createThreadSaga);
  yield takeEvery(actionTypes.CREATE_POST, createPostSaga);
  yield takeEvery(actionTypes.EDIT_POST, editPostSaga);
  yield takeEvery(actionTypes.DELETE_POST, deletePostSaga);
  yield takeEvery(actionTypes.CREATE_MESSAGE, createMessageSaga);
  yield takeEvery(actionTypes.CREATE_MESSAGE_POST, createMessagePostSaga);
  yield takeEvery(actionTypes.EDIT_MESSAGE_POST, editMessagePostSaga);
  yield takeEvery(actionTypes.DELETE_MESSAGE_POST, deleteMessagePostSaga);
  yield takeEvery(actionTypes.CREATE_RATING, createRatingSaga);
  yield takeEvery(actionTypes.DELETE_RATING, deleteRatingSaga);
}

export function* watchAuth() {
  yield takeEvery(actionTypes.FETCH_USER_INIT, fetchUserSaga);
  yield takeEvery(actionTypes.LOGOUT_USER_INIT, logoutUserSaga);
}