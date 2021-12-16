import {
  logout,
  login,
  requestPasswordReset,
  performPasswordReset,
  changePassword,
  userDetails,
} from "./apiCalls";
import { createReduxApp } from "../appCreator";

function logName(raw) {
  return `API_${raw}`;
}

const LOGOUT = logName("LOGOUT");
const LOGIN = logName("LOGIN");
const REQUEST_PASSWORD_RESET = logName("REQUEST_PASSWORD_RESET");
const PERFORM_PASSWORD_RESET = logName("PERFORM_PASSWORD_RESET");
const CHANGE_PASSWORD = logName("CHANGE_PASSWORD");
const USER_DETAILS = logName("USER_DETAILS");

export const apiReduxApps = {
  [LOGOUT]: createReduxApp({
    BASE_TYPE: LOGOUT,
    apiCaller: logout,
  }),

  [LOGIN]: createReduxApp({
    BASE_TYPE: LOGIN,
    apiCaller: login,
  }),

  [REQUEST_PASSWORD_RESET]: createReduxApp({
    BASE_TYPE: REQUEST_PASSWORD_RESET,
    apiCaller: requestPasswordReset,
  }),

  [PERFORM_PASSWORD_RESET]: createReduxApp({
    BASE_TYPE: PERFORM_PASSWORD_RESET,
    apiCaller: performPasswordReset,
  }),

  [CHANGE_PASSWORD]: createReduxApp({
    BASE_TYPE: CHANGE_PASSWORD,
    apiCaller: changePassword,
  }),

  [USER_DETAILS]: createReduxApp({
    BASE_TYPE: USER_DETAILS,
    apiCaller: userDetails,
    responseEntityType: "loggedInUser",
    responseIsList: false,
  }),
};

const allReducers = {};

Object.keys(apiReduxApps).forEach((key) => {
  allReducers[key] = apiReduxApps[key].reducer;
});

export const apiReduxReducers = { ...allReducers };

export const apiReduxWatchers = Object.keys(apiReduxApps)
  .map((key) => apiReduxApps[key].sagaWatchers)
  .flat();
