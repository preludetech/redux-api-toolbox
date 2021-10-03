// #DOCS you'll need to add a few things to your redux store if you have one

import { applyMiddleware, createStore, combineReducers, compose } from "redux";
import createSagaMiddleware from "redux-saga";
// import { createLogger } from "redux-logger"; // you dont strictly need this, but it's quite nice
import { rootSaga } from "./sagas.js";
// import mainApp from "./main-app/index.js";
import { apiReduxReducers } from "../apis";

import { apiReduxReducers as authReducers } from "@sheenarbw/redux-django-rest-framework/src/djRestAuth";

import apiEntities from "@sheenarbw/redux-django-rest-framework/src/apiEntities";

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = // this is so that you can use the redux chrome debugger extension
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

export const store = createStore(
  combineReducers({
    ...authReducers,
    ...apiReduxReducers,
    apiEntities,
  }),
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);
