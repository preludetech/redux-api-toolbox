import types from './types.js';

const INITIAL_STATE = {};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // case types.ADD_NEW_TOAST:
    //   return state; // this is handled by sagas
    case types.ADD_NEW_TOAST_SUCCESS:
      return {
        ...state,
        [action.index]: {
          severity: action.severity,
          heading: action.heading,
          message: action.message,
          timeout: action.timeout,
        },
      };
    case types.REMOVE_TOAST: {
      const result = {};

      Object.keys(state)
        .filter(index => parseInt(index, 10) !== parseInt(action.index, 10))
        .forEach(key => {
          result[key] = state[key];
        });
      return result;
    }

    default:
      return state;
  }
};

export default reducer;
