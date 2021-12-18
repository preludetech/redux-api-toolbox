import types from './types.js';

const INITIAL_STATE = {
  toasts: {},
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // case types.ADD_NEW_TOAST:
    //   return state; // this is handled by sagas
    case types.ADD_NEW_TOAST_SUCCESS:
      return {
        ...state,
        toasts: {
          ...state.toasts,

          [action.index]: {
            severity: action.severity,
            heading: action.heading,
            message: action.message,
            timeout: action.timeout,
          },
        },
      };
    case types.REMOVE_TOAST: {
      const toasts = {};

      Object.keys(state.toasts)
        .filter(index => parseInt(index, 10) !== parseInt(action.index, 10))
        .forEach(key => {
          toasts[key] = state[key];
        });
      return {
        ...state,
        toasts,
      };
    }

    default:
      return state;
  }
};

export default reducer;
