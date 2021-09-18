export const getEntityArray = ({ state, entityType }) => {
  return (
    (state.apiEntities &&
      state.apiEntities[entityType] &&
      Object.values(state.apiEntities[entityType])) ||
    []
  );
};

export const getSingleEntity = ({ state, entityType, id }) => {
  return (
    state.apiEntities &&
    state.apiEntities[entityType] &&
    state.apiEntities[entityType][id]
  );
};
