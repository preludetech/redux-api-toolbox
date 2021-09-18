import types from "./types.js";

export default {
  addEntitiesToStoreAsObject: ({ entitiesObject, entityType }) => {
    return {
      type: types.ADD_API_ENTITIES_RESPONSE_TO_STORE,
      entitiesObject,
      entityType,
    };
  },
};
