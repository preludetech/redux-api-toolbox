// strict;

import { takeEvery, put, select, delay, fork } from 'redux-saga/effects';

import types from './types.js';
import operations from './operations.js';

// function sleep({ seconds }) {
//   return new Promise(resolve => {
//     setTimeout(resolve, 1000 * seconds);
//   });
// }

function* removeToast({ timeout, index }) {
  yield delay(timeout);
  yield put(
    operations.removeToast({
      index,
    })
  );
}

function* addNewToastSideEffects(action) {
  const state = yield select(s => s);
  const indices = Object.keys(state.toaster);
  const index = indices.length === 0 ? 1 : Math.max(indices + 1);

  yield put(
    operations.addNewToastSuccess({
      index,
      severity: action.severity,
      heading: action.heading,
      message: action.message,
      timeout: action.timeout,
    })
  );

  if (action.timeout > 0) {
    yield fork(removeToast, {
      timeout: action.timeout,
      index,
    });
  }
}

function* watchAddNewToast() {
  yield takeEvery(types.ADD_NEW_TOAST, addNewToastSideEffects);
}

export const toasterSagas = [watchAddNewToast()];
export default toasterSagas;
