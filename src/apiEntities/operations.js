import Creators from "./actions.js";

const arrayToObjectWithIdKeys = ({ entityList }) => {
  let dataAsObject = {};

  entityList.forEach((element) => {
    dataAsObject[element.id] = element;
  });
  return dataAsObject;
};

const addEntityListToStore = ({ entityList, entityType }) => {
  return Creators.addEntitiesToStoreAsObject({
    entitiesObject: arrayToObjectWithIdKeys({ entityList }),
    entityType,
  });
};

export default {
  ...Creators,
  addEntityListToStore,
};
