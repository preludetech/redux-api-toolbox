import Creators from "./actions.js";

const arrayToObjectWithIdKeys = ({ entityList }) => {
  let dataAsObject = {};

  const actualList =
    entityList.forEach === undefined ? entityList.results : entityList;

  actualList.forEach((element) => {
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

const removeEntityListFromStore = ({ entityList, entityType }) => {
  return Creators.removeEntitiesFromStoreAsObject({
    entitiesObject: arrayToObjectWithIdKeys({ entityList }),
    entityType,
  });
};

export default {
  ...Creators,
  addEntityListToStore,
  removeEntityListFromStore,
};
