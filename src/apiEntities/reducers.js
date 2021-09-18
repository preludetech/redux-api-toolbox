import types from "./types";

const INITIAL_STATE = {};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.ADD_API_ENTITIES_RESPONSE_TO_STORE:
      // entitiesObject, entityType;
      //       responseIsList
      // responseEntityType
      const allInstances = state[action.entityType]
        ? { ...state[action.entityType], ...action.entitiesObject }
        : action.entitiesObject;

      return {
        ...state,
        [action.entityType]: allInstances,
      };

    default:
      return state;
  }
};

export default reducer;
