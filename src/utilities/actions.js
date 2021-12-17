import types from "./types.js";

export default {
  addNewToast: ({ severity, heading, message, timeout }) => ({
    type: types.ADD_NEW_TOAST,
    severity,
    heading,
    message,
    timeout,
  }),

  addNewToastSuccess: ({ index, severity, heading, message, timeout }) => ({
    type: types.ADD_NEW_TOAST_SUCCESS,
    index,
    severity,
    heading,
    message,
    timeout,
  }),

  removeToast: ({ index }) => ({
    type: types.REMOVE_TOAST,
    index,
  }),

  pageRedirect: ({ url }) => ({
    type: types.PAGE_REDIRECT,
    url,
  }),
};
