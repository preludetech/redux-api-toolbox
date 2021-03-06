import { getLatestMatchingCall as rawGetLatestMatchingCall } from "../appCreator";

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

export const getLatestMatchingCall = ({
  callLog,
  state,
  BASE_TYPE,
  requestData,
}) => {
  const calculatedCallLog = callLog || state[BASE_TYPE];
  return rawGetLatestMatchingCall({ callLog: calculatedCallLog, requestData });
};
