import { put } from "redux-saga/effects";

import axios from "../../axios-forums";
import * as actions from "../actions";

export function* fetchUserSaga(action) {
  try {
    const response = yield axios.get(
      "/api/fetch_user"
    );
    yield put(actions.fetchUserSuccess(response.data));
  } catch (error) {
  }
}

export function* logoutUserSaga(action) {
  try {
    const response = yield axios.get(
      "/api/logout"
    );
    if(response.data.logout === 1) {
      yield put(actions.logoutUserSuccess());
    }
  } catch (error) {
  }
}