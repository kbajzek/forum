import { takeEvery} from "redux-saga/effects";

import * as actionTypes from "../actions/actionTypes";
import {
  initCategoryDataSaga,
  initSubCategoryPageDataSaga
} from "./forums";

export function* watchForums() {
  yield takeEvery(actionTypes.INIT_CATEGORY_DATA, initCategoryDataSaga);
  yield takeEvery(actionTypes.INIT_SUB_CATEGORY_PAGE_DATA, initSubCategoryPageDataSaga);
}