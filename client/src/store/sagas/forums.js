import { put, take, select } from "redux-saga/effects";

import axios from "../../axios-forums";

// import * as threadActions from '../ducks/thread';
import * as actions from "../actions";
import * as actionTypes from '../actions/actionTypes';

// export function* initCategoryDataSaga(action) {
//   try {
//     yield put(actions.setCategoryData(null));
//     const response = yield axios.get(
//       "/api/forums"
//     );
//     yield put(actions.setCategoryData(response.data));
//   } catch (error) {
//     yield put(actions.initCategoryDataFailed(error.response.data));
//   }
// }

// export function* refreshCategoryDataSaga(action) {
//   try {
//     const response = yield axios.get(
//       "/api/forums"
//     );
//     yield put(actions.setCategoryData(response.data));
//   } catch (error) {
//     yield put(actions.refreshCategoryDataFailed(error.response.data));
//   }
// }

// export function* initSubCategoryPageDataSaga(action) {
//   try {
//     yield put(actions.setSubCategoryPageData(null));
//     const response = yield axios.get(
//       "/api/forums" + action.subCategoryId
//     );
//     yield put(actions.setSubCategoryPageData(response.data));
//   } catch (error) {
//     yield put(actions.initSubCategoryPageDataFailed(error.response.data));
//   }
// }

// export function* refreshSubCategoryPageDataSaga(action) {
//   try {
//     const response = yield axios.get(
//       "/api/forums" + action.subCategoryId
//     );
//     yield put(actions.setSubCategoryPageData(response.data));
//   } catch (error) {
//     yield put(actions.refreshSubCategoryPageDataFailed(error.response.data));
//   }
// }

// export function* initThreadDataSaga(action) {
//   try {
//     yield put(actions.setThreadData(null));
//     const response = yield axios.get(
//       "/api/forums" + action.path
//     );
//     yield put(actions.setThreadData(response.data));
//   } catch (error) {
//     yield put(actions.initThreadDataFailed(error.response.data));
//   }
// }

// export function* refreshThreadDataSaga(action) {
//   try {
//     const response = yield axios.get(
//       "/api/forums" + action.path
//     );
//     yield put(actions.setThreadData(response.data));
//   } catch (error) {
//     yield put(actions.refreshThreadDataFailed(error.response.data));
//   }
// }

export function* initUserDataSaga(action) {
  try {
    yield put(actions.setUserData(null));
    const response = yield axios.get(
      "/api/forums" + action.path
    );
    yield put(actions.setUserData(response.data));
  } catch (error) {
    yield put(actions.initUserDataFailed(error.response.data));
  }
}

export function* refreshUserDataSaga(action) {
  try {
    const response = yield axios.get(
      "/api/forums" + action.path
    );
    yield put(actions.setUserData(response.data));
  } catch (error) {
    yield put(actions.refreshUserDataFailed(error.response.data));
  }
}

export function* initMessageDataSaga(action) {
  try {
    // yield put(actions.setMessageData(null));
    const response = yield axios.get(
      "/api/forums" + action.path
    );
    const state = yield select();
    if (state.forums.waitOnExitingPage) {
      yield take(actionTypes.WAIT_ON_EXITING_PAGE);
    }
    yield put(actions.setMessageData(response.data));
    yield put(actions.hidePage(false));
  } catch (error) {
    yield put(actions.initMessageDataFailed(error.response.data));
    yield put(actions.hidePage(false));
  }
}

export function* refreshMessageDataSaga(action) {
  try {
    const response = yield axios.get(
      "/api/forums" + action.path
    );
    yield put(actions.setMessageData(response.data));
  } catch (error) {
    yield put(actions.refreshMessageDataFailed(error.response.data));
  }
}

export function* selectMessageDataSaga(action) {
  try {
    if (action.history) {
      yield action.history.push("/forums" + action.path);
      //yield put(actions.setMessagePostData(null));
    }
    const response = yield axios.get(
      "/api/forums" + action.path
    );
    yield put(actions.setMessagePostData(response.data.messageSelected));
  } catch (error) {
    yield put(actions.selectMessageDataFailed(error.response.data));
  }
}

export function* fetchUserlistSaga(action) {
  try {
    const response = yield axios.get(
      "/api/forums/userlist", {
        params: {
          search: action.search
        }
      }
    );
    yield put(actions.fetchUserlistSuccess(response.data.users));
  } catch (error) {
    yield put(actions.fetchUserlistFailed(error.response.data));
  }
}

// export function* createCategorySaga(action) {
//   try {
//     yield axios.post(
//       "/api/forums/category/create", {
//         name: action.name
//       }
//     );
//     yield put(actions.refreshCategoryData());
//   } catch (error) {
//     yield put(actions.createCategoryFailed(error.response.data));
//   }
// }

// export function* createSubCategorySaga(action) {
//   try {
//     yield axios.post(
//       "/api/forums/subcategory/create", {
//         name: action.name,
//         description: action.description,
//         categoryId: action.categoryId,
//         subcategoryId: action.subCategoryId
//       }
//     );
//     if (action.categoryId) {
//       yield put(actions.refreshCategoryData(action.path));
//     } else {
//       yield put(actions.refreshSubCategoryPageData(action.path));
//     }
//   } catch (error) {
//     yield put(actions.createSubCategoryFailed(error.response.data));
//   }
// }

// export function* createThreadSaga(action) {
//   try {
//     const response = yield axios.post(
//       "/api/forums/thread/create", {
//         name: action.name,
//         content: action.content,
//         userId: action.userId,
//         subcategoryId: action.subCategoryId
//       }
//     );
//     yield action.history.push("/forums" + response.data.path);
//   } catch (error) {
//     yield put(actions.createThreadFailed(error.response.data));
//   }
// }

// export function* createPostSaga(action) {
//   try {
//     const response = yield axios.post(
//       "/api/forums/post/create", {
//         content: action.content,
//         userId: action.userId,
//         threadId: action.threadId
//       }
//     );
//     yield put(threadActions.fetchThreadDataBegin(response.data.path));
//     yield action.history.push("/forums" + response.data.path + "#" + response.data.postId);
//   } catch (error) {
//     yield put(actions.createPostFailed(error.response.data));
//   }
// }

// export function* editPostSaga(action) {
//   try {
//     const response = yield axios.post(
//       "/api/forums/post/edit", {
//         content: action.content,
//         postId: action.postId
//       }
//     );
//     yield put(threadActions.fetchThreadDataBegin(response.data.path));
//     yield action.history.push("/forums" + response.data.path + "#" + response.data.postId);
//   } catch (error) {
//     yield put(actions.editPostFailed(error.response.data));
//   }
// }

// export function* deletePostSaga(action) {
//   try {
//     const response = yield axios.post(
//       "/api/forums/post/delete", {
//         postId: action.postId
//       }
//     );
//     if (response.data.response === 1) {
//       yield action.history.push("/forums");
//     } else {
//       yield put(threadActions.fetchThreadDataBegin(response.data.path));
//     }
//   } catch (error) {
//     yield put(actions.deletePostFailed(error.response.data));
//   }
// }

export function* createMessageSaga(action) {
  try {
    const response = yield axios.post(
      "/api/forums/message/create", {
        name: action.name,
        content: action.content,
        members: action.members
      }
    );
    yield put(actions.refreshMessageData(response.data.path));
    yield action.history.push("/forums" + response.data.path);
  } catch (error) {
    yield put(actions.createMessageFailed(error.response.data));
  }
}

export function* createMessagePostSaga(action) {
  try {
    const response = yield axios.post(
      "/api/forums/messagepost/create", {
        content: action.content,
        messageId: action.messageId,
        path: action.path
      }
    );
    yield put(actions.refreshMessageData(response.data.path));
    yield action.history.push("/forums" + response.data.path);
  } catch (error) {
    yield put(actions.createMessagePostFailed(error.response.data));
  }
}

export function* editMessagePostSaga(action) {
  try {
    const response = yield axios.post(
      "/api/forums/messagepost/edit", {
        content: action.content,
        messagepostId: action.messagePostId,
        path: action.path
      }
    );
    yield put(actions.refreshMessageData(response.data.path));
    yield action.history.push("/forums" + response.data.path);
  } catch (error) {
    yield put(actions.editMessagePostFailed(error.response.data));
  }
}

export function* deleteMessagePostSaga(action) {
  try {
    const response = yield axios.post(
      "/api/forums/messagepost/delete", {
        content: action.content,
        messagepostId: action.messagePostId,
        path: action.path
      }
    );
    yield put(actions.refreshMessageData(response.data.path));
    yield action.history.push("/forums" + response.data.path);
  } catch (error) {
    yield put(actions.deleteMessagePostFailed(error.response.data));
  }
}

// export function* createRatingSaga(action) {
//   try {
//     yield axios.post(
//       "/api/forums/rating/create", {
//         userId: action.userId,
//         postId: action.postId,
//         ratingtypeId: action.ratingTypeId,
//         path: action.path
//       }
//     );
//     yield put(threadActions.fetchThreadDataBegin(action.path));
//   } catch (error) {
//     yield put(actions.createRatingFailed(error.response.data));
//   }
// }

// export function* deleteRatingSaga(action) {
//   try {
//     yield axios.post(
//       "/api/forums/rating/delete", {
//         userId: action.userId,
//         postId: action.postId,
//         path: action.path
//       }
//     );
//     yield put(threadActions.fetchThreadDataBegin(action.path));
//   } catch (error) {
//     yield put(actions.deleteRatingFailed(error.response.data));
//   }
// }

export function* removeMessageMemberSaga(action) {
  try {
    yield axios.post(
      "/api/forums/messagemember/delete", {
        memberId: action.memberId
      }
    );
    yield put(actions.refreshMessageData(action.path));
  } catch (error) {
    yield put(actions.removeMessageMemberFailed(error.response.data));
  }
}