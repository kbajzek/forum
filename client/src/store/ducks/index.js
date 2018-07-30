import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";

// old format, replace these
import authReducer from "../reducers/auth";
import forumReducer from "../reducers/forums";
import { watchForums, watchAuth, watchSockets } from "../sagas";
import { reducer as formReducer } from 'redux-form';

//new 'ducks' format
import categoryReducer from "./category";
import {watchCategory} from "./category";
import subCategoryReducer from "./subCategory";
import {watchSubCategory} from "./subCategory";
import threadReducer from "./thread";
import {watchThread} from "./thread";

const composeEnhancers =
(process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null) || compose;

const rootReducer = combineReducers({
  forums: forumReducer,
  form: formReducer,
  auth: authReducer,

  category: categoryReducer,
  subCategory: subCategoryReducer,
  thread: threadReducer,
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(watchAuth);
sagaMiddleware.run(watchForums);
sagaMiddleware.run(watchSockets);

sagaMiddleware.run(watchCategory);
sagaMiddleware.run(watchSubCategory);
sagaMiddleware.run(watchThread);

export default store;