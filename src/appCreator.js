import { takeEvery, put, call, select } from "redux-saga/effects";
import { apiEntitiesOperations } from "./apiEntities";
import { toasterOperations } from "./toaster/index.js";

const INITIAL_SINGLE_API_CALL_STATE = {
  loading: false,
  requestData: null,
  error: null,
  responseData: null,
  responseOk: null,
  // TODO add timestamps for sent and response time
};

const INITIAL_API_CALL_LOG_STATE = {};

export function createReduxApp({
  BASE_TYPE,
  apiCaller,
  take = takeEvery,

  // assuming we are fetching some kind of entity from the backend,
  // where and how should we store it in the ApiEntity store?
  responseIsList,
  responseEntityType,
  // and if the api call is about deleting stuff, then that stuff should be removed from the store
  removeFromStore,
}) {
  if (!apiCaller) {
    throw new Error(
      `createReduxApp got a falsey apiCaller! BASE_TYPE=${BASE_TYPE}`
    );
  }

  const types = {
    ADD_NEW_START: `API_${BASE_TYPE}_ADD_NEW_START`,
    ADD_NEW_START_SEQUENCE: `API_${BASE_TYPE}_ADD_NEW_START_SEQUENCE`,
    MAYBE_ADD_NEW_START_SEQUENCE: `API_${BASE_TYPE}_MAYBE_ADD_NEW_START_SEQUENCE`,
    START: `API_${BASE_TYPE}_START`,
    SUCCESS: `API_${BASE_TYPE}_SUCCESS`,
    ERROR: `API_${BASE_TYPE}_ERROR`,
    RESPONSE_ERROR: `API_${BASE_TYPE}_RESPONSE_ERROR`,
  };

  const creators = {
    start: ({ data, successToast, successDispatchActions }) => ({
      type: types.ADD_NEW_START,
      data,
      successToast,
      successDispatchActions,
      force: true,
    }),

    maybeStart: ({ data, successToast, successDispatchActions }) => ({
      type: types.ADD_NEW_START,
      data,
      successToast,
      successDispatchActions,
      force: false,
    }),

    startCallSequence: ({ dataSequence }) =>
      // if you start many calls in quick succession then
      // sometimes the callIndex values get muddled up. This is a quick fix
      ({
        type: types.ADD_NEW_START_SEQUENCE,
        dataSequence,
        force: true,
      }),
    maybeStartCallSequence: ({ dataSequence }) =>
      // if you start many calls in quick succession then
      // sometimes the callIndex values get muddled up. This is a quick fix
      ({
        type: types.ADD_NEW_START_SEQUENCE,
        dataSequence,
        force: false,
      }),

    _start: ({ data, callIndex, successToast, successDispatchActions }) => {
      if (callIndex === undefined)
        throw new Error("Always include the call index while making api calls");
      return {
        type: types.START,
        data,
        callIndex,
        successToast,
        successDispatchActions,
      };
    },

    success: ({ data, requestData, callIndex }) => {
      if (callIndex === undefined)
        throw new Error("Always include the call index while making api calls");
      return {
        type: types.SUCCESS,
        responseData: data,
        requestData,
        callIndex,
      };
    },

    error: ({ error, requestData, callIndex }) => {
      if (callIndex === undefined)
        throw new Error("Always include the call index while making api calls");
      return {
        type: types.ERROR,
        error,
        requestData,
        callIndex,
      };
    },

    responseError: ({ data, requestData, callIndex }) => {
      if (callIndex === undefined)
        throw new Error("Always include the call index while making api calls");
      return {
        type: types.RESPONSE_ERROR,
        responseData: data,
        requestData,
        callIndex,
      };
    },
  };

  const operations = {
    ...creators,

    maybeStart: (params) => {
      const { data, successToast, successDispatchActions } = params;

      if (data === undefined || data === null) {
        throw new Error("call data cannot be undefined or null");
      }
      return creators.maybeStart({
        data,
        successToast,
        successDispatchActions,
      });
    },

    // forceStart: (params) => {
    //   throw new Error("forceStart. do we use this??");
    //   const { data } = params;
    //   return creators.start({ data });
    // },
  };

  const reducer = (state = INITIAL_API_CALL_LOG_STATE, action) => {
    const { callIndex } = action;

    if (
      action.type !== types.ADD_NEW_START &&
      action.type !== types.ADD_NEW_START_SEQUENCE &&
      Object.values(types).indexOf(action.type) !== -1 &&
      callIndex === undefined
    )
      throw new Error("Always include the call index while making api calls");

    switch (action.type) {
      case types.START: {
        const startState = { ...state };
        startState[callIndex] = {
          ...INITIAL_SINGLE_API_CALL_STATE,
          loading: true,
          requestData: action.data,
          successToast: action.successToast,
          successDispatchActions: action.successDispatchActions,
          callIndex,
        };
        return startState;
      }

      // can there be race conditions here? I dont know.
      // the error checking should pick it up

      case types.SUCCESS:
        const successState = { ...state };
        successState[callIndex] = {
          ...state[callIndex],
          loading: false,
          responseData: action.responseData,
          responseOk: true,
        };
        return successState;

      case types.ERROR:
        const errorState = { ...state };
        errorState[callIndex] = {
          ...state[callIndex],
          loading: false,
          error: action.error,
        };
        return errorState;

      case types.RESPONSE_ERROR:
        const responseErrorState = { ...state };
        responseErrorState[callIndex] = {
          ...state[callIndex],
          loading: false,
          responseData: action.responseData,
          responseOk: false,
        };
        return responseErrorState;

      default:
        return state;
    }
  };

  function* sideEffects(action) {
    const requestData = action.data;
    const { callIndex } = action;

    try {
      const { response, responseData } = yield call(apiCaller, requestData);

      if (response.ok) {
        yield put(
          operations.success({ data: responseData, requestData, callIndex })
        );

        // console.log(action);

        if (action.successToast) {
          yield put(toasterOperations.addNewToast(action.successToast));
        }

        if (action.successDispatchActions) {
          for (let sideEffect of action.successDispatchActions)
            yield put(sideEffect);
        }
      } else {
        yield put(
          operations.responseError({
            data: responseData,
            requestData,
            callIndex,
          })
        );
      }
    } catch (e) {
      yield put(
        operations.error({ error: e.toString(), requestData, callIndex })
      );
    }
  }

  function* watchStart() {
    yield take(types.START, sideEffects);
  }

  function* addNewStartSideEffects(action) {
    if (action.data === undefined) {
      throw new Error(
        `action object is missing data key. Expected something like: {data:{api,call,args}} but got: ${JSON.stringify(
          action
        )}`
      );
    }

    const { force } = action;
    if (force === undefined) throw new Error("force should be set");
    const callLog = yield select((state) => state[BASE_TYPE]);
    const callIndex = Object.keys(callLog).length;

    const matchingCall = getLatestMatchingCall({
      callLog,
      requestData: action.data,
    });

    if (force | !matchingCall) {
      yield put(
        operations._start({
          data: action.data,
          successToast: action.successToast,
          successDispatchActions: action.successDispatchActions,
          callIndex,
        })
      );
    }
  }

  function* watchAddNewStart() {
    yield takeEvery(types.ADD_NEW_START, addNewStartSideEffects);
  }

  function* addNewStartSequenceSideEffects(action) {
    const { force } = action;
    if (force === undefined) throw new Error("force should be set");
    const callLog = yield select((state) => state[BASE_TYPE]);

    const callIndex = Object.keys(callLog).length;
    const { dataSequence } = action;
    if (dataSequence === undefined)
      throw new Error("dataSequence should be set");

    for (let index in dataSequence) {
      let data = dataSequence[index];
      let matchingCall = getLatestMatchingCall({ callLog, requestData: data });

      if (force | !matchingCall) {
        const currentCallIndex = callIndex + parseInt(index);
        yield put(
          operations._start({
            data,
            callIndex: currentCallIndex,
          })
        );
      }
    }
  }

  function* watchAddNewStartSequence() {
    yield takeEvery(
      types.ADD_NEW_START_SEQUENCE,
      addNewStartSequenceSideEffects
    );
  }

  function* successSideEffects(action) {
    let entityList;
    if (responseIsList) {
      entityList = action.responseData;
    } else {
      // console.log(action.responseData)
      // throw new Error("todo: deal with single entity");
      entityList = [action.responseData];
    }

    if (removeFromStore) {
      yield put(
        apiEntitiesOperations.removeEntityListFromStore({
          entityList,
          entityType: responseEntityType,
        })
      );
    } else {
      yield put(
        apiEntitiesOperations.addEntityListToStore({
          entityList,
          entityType: responseEntityType,
        })
      );
    }
  }

  function* watchSuccess() {
    if (responseEntityType) {
      yield takeEvery(types.SUCCESS, successSideEffects);
    }
  }

  const sagaWatchers = [
    watchStart(),
    watchAddNewStart(),
    watchAddNewStartSequence(),
    watchSuccess(),
  ];

  return {
    types,
    creators,
    operations,
    reducer,
    sagaWatchers,
    BASE_TYPE,
  };
}

/* read through the call log and get the latest call data that matches the provided request parameters */
export function getLatestMatchingCall({ callLog, requestData }) {
  for (let key in requestData)
    if (requestData[key] === undefined)
      throw new Error(
        `cannot search for requests with undefined parameter values. key=${key} requestData = ${JSON.stringify(
          requestData
        )}`
      );

  if (callLog === undefined) return;
  const indices = Object.keys(callLog).sort((a, b) => b - a);
  const matchingIndex = indices.find((index) => {
    const logEntry = callLog[index];
    for (let key in requestData) {
      if (
        logEntry.requestData[key] !== undefined &&
        typeof logEntry.requestData[key] !== typeof requestData[key]
      ) {
        console.error(
          `comparing request data of different types for key: \n\ttypeof logEntry.requestData[${key}] = ${typeof logEntry
            .requestData[
            key
          ]}\n\ttypeof requestData[${key}] = ${typeof requestData[key]}`
        );
      }
      if (logEntry.requestData[key] !== requestData[key]) return false;
    }
    return true;
  });
  return callLog[matchingIndex];
}
