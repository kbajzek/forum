import { put } from "redux-saga/effects";

import axios from "../../axios-forums";
import * as actions from "../actions";

export function* fetchUserSaga(action) {
  try {
    const response = yield axios.get(
      "/api/fetch_user"
    );
    yield axios.defaults.headers.common['X-XSRF-TOKEN'] = response.data.csrf;
    yield put(actions.fetchUserSuccess(response.data.user, response.data.csrf));
  } catch (error) {
  }
}

export function* logoutUserSaga(action) {
  try {
    const response = yield axios.get(
      "/api/logout"
    );
    if(response.data.logout === 1) {
      yield axios.defaults.headers.common['X-XSRF-TOKEN'] = null;
      yield put(actions.logoutUserSuccess());
      window.location.reload();
    }
  } catch (error) {
  }
}