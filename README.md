# Redux DRF sagas

If you are running [Django Rest Framework](https://www.django-rest-framework.org/) on your backend then you can use these tools to get your js frontend to play nice with your backend. It's framework agnostic. It doesn't mean you would need to use redux as your main state management tool.

If you are using [dj-rest-auth](https://dj-rest-auth.readthedocs.io/en/latest/) on your backend, then this becomes even more useful. More on that later.

## How to install

```
npm i TODO
```

## Security

Chances are that you are using some kind of authentication on your apis. There are some helpers build in here that will work to store and retrieve authentication tokens in browser based session storage.

This needs work. Session storage can be tricked. Please do your research. The main thing is to be very very careful about XSS attacks. And pretty careful about CSRF too.

## How to use

### Initial configuration

If you are already using redux in your app, then you'll need to wire it up to include some extra sagas and reducers. If you aren't using redux already then you'll need to add this to your frontend:

```
TODO
```

### Defining api apps

Take a look in (here)[./src/apiEntities] to see some examples. These api apps basically do all the work of interacting with dj-rest-auth.

#### Storing and accessing entities

DRF is friggin wonderful when it comes to rapidly creating CRUD apis. So we can make use of that.

Let's say we are building an application that has a lot to do with log entries. You might want to add some apps that are just about doing cruddy things. For example:

```
export const apiReduxApps = {

[LOG_ENTRY_CREATE]: createReduxApp({
    // the BASE_TYPE is a string.  Each app needs to have a different name
    BASE_TYPE: LOG_ENTRY_CREATE,
    // the apiCaller is a function that makes the actual api call. Make use of the fetchUtils
    apiCaller: logEntryCreate,
    // we expect to get a single entity back from the backend, not a list. And
    // we've decided that it will be accessible in the entity store under the
    // name `logEntry`
    responseIsList: false,
    responseEntityType: "logEntry",
  }),

  [LOG_ENTRY_LIST]: createReduxApp({
    // this one gets an array/list of log entries
    BASE_TYPE: LOG_ENTRY_LIST,
    apiCaller: logEntryList,
    responseIsList: true,
    responseEntityType: "logEntry",
  }),

  [LOG_ENTRY_INSTANCE]: createReduxApp({
    // get a single instance from the backend
    BASE_TYPE: LOG_ENTRY_INSTANCE,
    apiCaller: logEntryInstance,
    responseIsList: false,
    responseEntityType: "logEntry",
  }),

  [LOG_ENTRY_DELETE]: createReduxApp({
    // delete an entity from the backend. Also remove it from the frontend store
    BASE_TYPE: LOG_ENTRY_DELETE,
    apiCaller: logEntryDelete,
    responseIsList: false,
    responseEntityType: "logEntry",
    removeFromStore: true,
  }),

  [LOG_ENTRY_UPDATE]: createReduxApp({
    BASE_TYPE: LOG_ENTRY_UPDATE,
    apiCaller: logEntryUpdate,
    responseIsList: false,
    responseEntityType: "logEntry",
  }),
}

// you would need to export a few extra goodies so you can plug these into your store
// no, this isn't as DRY as we would like it to be
// yes, we'll fix it. Sometime.

const allReducers = {};

Object.keys(apiReduxApps).forEach((key) => {
  allReducers[key] = apiReduxApps[key].reducer;
});

export const apiReduxReducers = { ...allReducers };

export const apiReduxWatchers = Object.keys(apiReduxApps)
  .map((key) => apiReduxApps[key].sagaWatchers)
  .flat();

```

### Triggering the api calls

In order to make an api call happen, we need to `dispatch` the right action.

Since there are about a million different frontend frameworks and tools, and they are all unique snowflakes (can you say javascript fatigue?) it's a bit hard to give you a complete demonstration of how to wire everything up in all cases. But the wiring needs to happen.

Here is an example of how you might [make dispatch work with React](https://react-redux.js.org/using-react-redux/connect-mapdispatch#defining-mapdispatchtoprops-as-a-function). But even within React there are many choices.

```
// import apiReduxApps from somewhere

store.dispatch(
    apiReduxApps.LOG_ENTRY_LIST.operations.maybeStart({
        data: { user },
    })
);
```

### Adding side effects

As an example, let's say you have a gui where a user can add a log entry. When the user hits save then you dispatch the `start` action for the `LOG_ENTRY_CREATE` app. You can use sagas in the normal way.

Something like:

```
function* watchApiLogEntryCreateSuccess() {
  yield takeEvery(
    apiReduxApps.LOG_ENTRY_CREATE.types.SUCCESS,
    apiLogEntryCreateSuccessSideEffects
  );
}

```

