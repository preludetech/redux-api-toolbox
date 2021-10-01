import { all } from "redux-saga/effects";

import { apiReduxWatchers as coreApiReduxWatchers } from "@sheenarbw/redux-django-rest-framework/src/djRestAuth";

import { apiReduxWatchers } from "../apis";

// import { mainAppSagas } from "./main-app/sagas.js";

export function* rootSaga() {
  yield all([...coreApiReduxWatchers, ...apiReduxWatchers]);
}
