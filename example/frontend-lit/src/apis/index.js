import { createReduxApp } from "@sheenarbw/redux-django-rest-framework/src/appCreator";

import {
  todoItemList,
  todoItemCreate,
  todoItemUpdate,
  todoItemDelete,
  todoItemInstance,
} from "./apiCalls";

const TODO_ITEM_CREATE = "TODO_ITEM_CREATE";
const TODO_ITEM_LIST = "TODO_ITEM_LIST";
const TODO_ITEM_INSTANCE = "TODO_ITEM_INSTANCE";
const TODO_ITEM_DELETE = "TODO_ITEM_DELETE";
const TODO_ITEM_UPDATE = "TODO_ITEM_UPDATE";

export const apiReduxApps = {
  [TODO_ITEM_CREATE]: createReduxApp({
    BASE_TYPE: TODO_ITEM_CREATE,
    apiCaller: todoItemCreate,
    responseIsList: false,
    responseEntityType: "todoItem",
  }),

  [TODO_ITEM_LIST]: createReduxApp({
    BASE_TYPE: TODO_ITEM_LIST,
    apiCaller: todoItemList,
    responseIsList: true,
    responseEntityType: "todoItem",
  }),
  [TODO_ITEM_INSTANCE]: createReduxApp({
    BASE_TYPE: TODO_ITEM_INSTANCE,
    apiCaller: todoItemInstance,
    responseIsList: false,
    responseEntityType: "todoItem",
  }),
  [TODO_ITEM_DELETE]: createReduxApp({
    BASE_TYPE: TODO_ITEM_DELETE,
    apiCaller: todoItemDelete,
    responseIsList: false,
    responseEntityType: "todoItem",
    removeFromStore: true,
  }),
  [TODO_ITEM_UPDATE]: createReduxApp({
    BASE_TYPE: TODO_ITEM_UPDATE,
    apiCaller: todoItemUpdate,
    responseIsList: false,
    responseEntityType: "todoItem",
  }),
};

// #DOCS the stuff below this line is required!
const allReducers = {};

Object.keys(apiReduxApps).forEach((key) => {
  allReducers[key] = apiReduxApps[key].reducer;
});

export const apiReduxReducers = { ...allReducers };

export const apiReduxWatchers = Object.keys(apiReduxApps)
  .map((key) => apiReduxApps[key].sagaWatchers)
  .flat();
