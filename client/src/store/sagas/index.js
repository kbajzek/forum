import { takeEvery, take, put, call, apply, fork } from 'redux-saga/effects'
import { eventChannel, delay, buffers } from 'redux-saga'
import io from 'socket.io-client'

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
  selectMessageDataSaga,
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
  removeMessageMemberSaga,
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
  yield takeEvery(actionTypes.SELECT_MESSAGE_DATA, selectMessageDataSaga);
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
  yield takeEvery(actionTypes.REMOVE_MESSAGE_MEMBER, removeMessageMemberSaga);
}

export function* watchAuth() {
  yield takeEvery(actionTypes.FETCH_USER_INIT, fetchUserSaga);
  yield takeEvery(actionTypes.LOGOUT_USER_INIT, logoutUserSaga);
}










// this function creates an event channel from a given socket
// Setup subscription to incoming `ping` events
function createSocketChannel(socket) {
  // `eventChannel` takes a subscriber function
  // the subscriber function takes an `emit` argument to put messages onto the channel
  return eventChannel(emit => {

    const pingHandler = (event) => {
      // puts event payload into the channel
      // this allows a Saga to take this payload from the returned channel
      emit({payload: event})
    }

    // setup the subscription
    socket.on('user1', pingHandler)

    // the subscriber must return an unsubscribe function
    // this will be invoked when the saga calls `channel.close` method
    const unsubscribe = () => {
      socket.off('user1', pingHandler)
    }

    return unsubscribe
  }, buffers.expanding(10))
}

// reply with a `response` message by invoking `socket.emit('response')`
function* pong(socket) {
  yield call(delay, 5000);
  yield apply(socket, socket.emit, ['user1response', {my: 'data'}]) // call `emit` as a method with `socket` as context
}

export function* watchSockets() {
  const socket = yield call(io, '192.168.56.1:5000')
  const socketChannel = yield call(createSocketChannel, socket)

  while (true) {
    const payload = yield take(socketChannel)
    yield console.log(payload);
    //yield put({ type: actionTypes.INCOMING_PONG_PAYLOAD, payload })
    yield fork(pong, socket)
  }
}