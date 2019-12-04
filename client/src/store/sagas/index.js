import { takeEvery, take, put, call, apply, fork, select } from 'redux-saga/effects'
import { eventChannel, delay, buffers } from 'redux-saga'
import io from 'socket.io-client'
import * as actions from '../actions/index';

import * as categoryActions from '../ducks/category';
import * as subCategoryActions from '../ducks/subCategory';
import * as threadActions from '../ducks/thread';
import configFile from '../../config/config';
const config = JSON.stringify(process.env.NODE_ENV) === JSON.stringify('development') ? configFile.development : configFile.production;

import * as actionTypes from "../actions/actionTypes";
import {
  // initCategoryDataSaga,
  // refreshCategoryDataSaga,
  // initSubCategoryPageDataSaga,
  // refreshSubCategoryPageDataSaga,
  // initThreadDataSaga,
  // refreshThreadDataSaga,
  initUserDataSaga,
  refreshUserDataSaga,
  initMessageDataSaga,
  refreshMessageDataSaga,
  selectMessageDataSaga,
  // createCategorySaga,
  // createSubCategorySaga,
  // createThreadSaga,
  // createPostSaga,
  // editPostSaga,
  // deletePostSaga,
  createMessageSaga,
  createMessagePostSaga,
  editMessagePostSaga,
  fetchUserlistSaga,
  deleteMessagePostSaga,
  // createRatingSaga,
  // deleteRatingSaga,
  removeMessageMemberSaga,
} from "./forums";
import {
  fetchUserSaga,
  logoutUserSaga,
} from "./auth";

export function* watchForums() {
  // yield takeEvery(actionTypes.INIT_CATEGORY_DATA, initCategoryDataSaga);
  // yield takeEvery(actionTypes.REFRESH_CATEGORY_DATA, refreshCategoryDataSaga);
  // yield takeEvery(actionTypes.INIT_SUB_CATEGORY_PAGE_DATA, initSubCategoryPageDataSaga);
  // yield takeEvery(actionTypes.REFRESH_SUB_CATEGORY_PAGE_DATA, refreshSubCategoryPageDataSaga);
  // yield takeEvery(actionTypes.INIT_THREAD_DATA, initThreadDataSaga);
  // yield takeEvery(actionTypes.REFRESH_THREAD_DATA, refreshThreadDataSaga);
  yield takeEvery(actionTypes.INIT_USER_DATA, initUserDataSaga);
  yield takeEvery(actionTypes.REFRESH_USER_DATA, refreshUserDataSaga);
  yield takeEvery(actionTypes.INIT_MESSAGE_DATA, initMessageDataSaga);
  yield takeEvery(actionTypes.REFRESH_MESSAGE_DATA, refreshMessageDataSaga);
  yield takeEvery(actionTypes.SELECT_MESSAGE_DATA, selectMessageDataSaga);
  yield takeEvery(actionTypes.FETCH_USERLIST_INIT, fetchUserlistSaga);
  // yield takeEvery(actionTypes.CREATE_CATEGORY, createCategorySaga);
  // yield takeEvery(actionTypes.CREATE_SUB_CATEGORY, createSubCategorySaga);
  // yield takeEvery(actionTypes.CREATE_THREAD, createThreadSaga);
  // yield takeEvery(actionTypes.CREATE_POST, createPostSaga);
  // yield takeEvery(actionTypes.EDIT_POST, editPostSaga);
  // yield takeEvery(actionTypes.DELETE_POST, deletePostSaga);
  yield takeEvery(actionTypes.CREATE_MESSAGE, createMessageSaga);
  yield takeEvery(actionTypes.CREATE_MESSAGE_POST, createMessagePostSaga);
  yield takeEvery(actionTypes.EDIT_MESSAGE_POST, editMessagePostSaga);
  yield takeEvery(actionTypes.DELETE_MESSAGE_POST, deleteMessagePostSaga);
  // yield takeEvery(actionTypes.CREATE_RATING, createRatingSaga);
  // yield takeEvery(actionTypes.DELETE_RATING, deleteRatingSaga);
  yield takeEvery(actionTypes.REMOVE_MESSAGE_MEMBER, removeMessageMemberSaga);
}

export function* watchAuth() {
  yield takeEvery(actionTypes.FETCH_USER_INIT, fetchUserSaga);
  yield takeEvery(actionTypes.LOGOUT_USER_INIT, logoutUserSaga);
}

function connect() {
  const socket = io(config.base_url);
  return new Promise(resolve => {
    socket.on('connect', () => {
      resolve(socket);
    });
  });
}

function createSocketChannel(socket, eventName) {
  return eventChannel(emit => {
    const eventHandler = (event) => {emit(event)}
    socket.on(eventName, eventHandler)
    return () => {socket.off(eventName, eventHandler)}
  }, buffers.expanding(10))
}

function* updateMessages(socket) {
  const channel = yield call(createSocketChannel, socket, 'messages.update');
  while (true) {
    const messageId = yield take(channel);
    const state = yield select();
    if(state.forums.messageData && state.forums.messageData.messageSelected && state.forums.messageData.messageSelected.messageId == messageId){
      yield put(actions.selectMessageData("/message/" + messageId + '/' + state.forums.messageData.messageSelected.messageName));
    }
  }
}

export function* watchSockets() {
  const socket = yield call(connect)
  const messageTask = yield fork(updateMessages, socket);
  const locationTask = yield fork(handleLocationChange, socket);
}

export function* handleLocationChange(socket) {
  const channel = yield call(createSocketChannel, socket, 'usersViewing.update');
  while(true){
    const userViewingInfo = yield take(channel);
    const location = userViewingInfo.location.substring(0,2);
    
    if(location === '1'){
      yield put(categoryActions.setCategoryUsersViewing(userViewingInfo.users));
    }else if(location === '1/'){
      yield put(subCategoryActions.setSubCategoryUsersViewing(userViewingInfo.users));
    }else if(location === '2/'){
      yield put(threadActions.setThreadUsersViewing(userViewingInfo.users));
    }
  }
}