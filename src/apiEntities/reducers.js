import types from './types';

const INITIAL_STATE = {};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.ADD_API_ENTITIES_RESPONSE_TO_STORE: {
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
    }

    case types.REMOVE_API_ENTITIES_FROM_STORE: {
      const current = state[action.entityType] || {};
      const keysToRemove = Object.keys(action.entitiesObject);
      const finalKeys = Object.keys(current).filter(
        key => !keysToRemove.includes(key)
      );
      const final = {};
      for (let key of finalKeys) {
        final[key] = current[key];
      }

      return {
        ...state,
        [action.entityType]: final,
      };
    }

    default:
      return state;
  }
};

export default reducer;
