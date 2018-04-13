import { put } from "redux-saga/effects";

import axios from "../../axios-forums";
import * as actions from "../actions";

export function* initCategoryDataSaga(action) {
  try {
    yield put(actions.setCategoryData(null));
    const response = yield axios.get(
      "/api/forums"
    );
    yield put(actions.setCategoryData(response.data));
  } catch (error) {
    yield put(actions.fetchCategoryDataFailed());
  }
}

export function* initSubCategoryPageDataSaga(action) {
  try {
    yield put(actions.setSubCategoryPageData(null));
    const response = yield axios.get(
      "/api/forums" + action.path
    );
    yield put(actions.setSubCategoryPageData(response.data));
  } catch (error) {
    yield put(actions.fetchSubCategoryPageDataFailed());
  }
}

