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
    yield put(actions.initCategoryDataFailed());
  }
}

export function* refreshCategoryDataSaga(action) {
  try {
    const response = yield axios.get(
      "/api/forums"
    );
    yield put(actions.setCategoryData(response.data));
  } catch (error) {
    yield put(actions.refreshCategoryDataFailed());
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
    yield put(actions.initSubCategoryPageDataFailed());
  }
}

export function* refreshSubCategoryPageDataSaga(action) {
  try {
    const response = yield axios.get(
      "/api/forums" + action.path
    );
    yield put(actions.setSubCategoryPageData(response.data));
  } catch (error) {
    yield put(actions.refreshSubCategoryPageDataFailed());
  }
}

export function* initThreadDataSaga(action) {
  try {
    yield put(actions.setThreadData(null));
    const response = yield axios.get(
      "/api/forums" + action.path
    );
    yield put(actions.setThreadData(response.data));
  } catch (error) {
    yield put(actions.initThreadDataFailed(error.response.data));
  }
}

export function* refreshThreadDataSaga(action) {
  try {
    const response = yield axios.get(
      "/api/forums" + action.path
    );
    yield put(actions.setThreadData(response.data));
  } catch (error) {
    yield put(actions.refreshThreadDataFailed());
  }
}

export function* createCategorySaga(action) {
  try {
    yield axios.post(
      "/api/forums/category/create", {
        name: action.name
      }
    );
    yield put(actions.refreshCategoryData());
  } catch (error) {
    yield put(actions.createCategoryFailed(error));
  }
}

export function* createSubCategorySaga(action) {
  try {
    yield axios.post(
      "/api/forums/subcategory/create", {
        name: action.name,
        description: action.description,
        categoryId: action.categoryId,
        subCategoryId: action.subCategoryId
      }
    );
    if (action.categoryId) {
      yield put(actions.refreshCategoryData(action.path));
    } else {
      yield put(actions.refreshSubCategoryPageData(action.path));
    }
  } catch (error) {
    yield put(actions.createSubCategoryFailed(error));
  }
}

export function* createThreadSaga(action) {
  try {
    const response = yield axios.post(
      "/api/forums/thread/create", {
        name: action.name,
        content: action.content,
        userId: action.userId,
        subCategoryId: action.subCategoryId
      }
    );
    yield put(actions.refreshSubCategoryPageData(action.path));
    yield action.history.push("/forums" + response.data.threadPath);
  } catch (error) {
    yield put(actions.createThreadFailed(error));
  }
}

export function* createPostSaga(action) {
  try {
    const response = yield axios.post(
      "/api/forums/post/create", {
        content: action.content,
        userId: action.userId,
        threadId: action.threadId,
        path: action.path
      }
    );
    yield put(actions.refreshThreadData(action.path));
    yield action.history.push("/forums" + action.path + "#" + response.data.postId);
  } catch (error) {
    yield put(actions.createPostFailed(error));
  }
}

export function* editPostSaga(action) {
  try {
    const response = yield axios.post(
      "/api/forums/post/edit", {
        content: action.content,
        postId: action.postId,
        path: action.path
      }
    );
    yield put(actions.refreshThreadData(action.path));
    yield action.history.push("/forums" + action.path + "#" + response.data.postId);
  } catch (error) {
    yield put(actions.editPostFailed(error));
  }
}

export function* deletePostSaga(action) {
  try {
    const response = yield axios.post(
      "/api/forums/post/delete", {
        postId: action.postId
      }
    );
    if (response.data.response === 1) {
      yield action.history.push("/forums");
      yield put(actions.setThreadData(null));
    } else {
      yield put(actions.refreshThreadData(action.path));
    }
  } catch (error) {
    yield put(actions.deletePostFailed(error));
  }
}

export function* createRatingSaga(action) {
  try {
    yield axios.post(
      "/api/forums/rating/create", {
        userId: action.userId,
        postId: action.postId,
        ratingTypeId: action.ratingTypeId,
        path: action.path
      }
    );
    yield put(actions.refreshThreadData(action.path));
  } catch (error) {
    yield put(actions.createRatingFailed(error));
  }
}

export function* deleteRatingSaga(action) {
  try {
    yield axios.post(
      "/api/forums/rating/delete", {
        userId: action.userId,
        postId: action.postId,
        path: action.path
      }
    );
    yield put(actions.refreshThreadData(action.path));
  } catch (error) {
    yield put(actions.deleteRatingFailed(error));
  }
}