import { html, LitElement, css } from "lit";
import { connect } from "pwa-helpers";
// import { router, navigator } from "lit-element-router";
import { store } from "./redux/store";
// import { navigationRoutes, navigationRoutesList } from "./routes";
// import { isUserLoggedIn, authUserData } from "./redux/main-app/selectors.js";
import { apiReduxApps } from "./apis";

import {
  getEntityArray,
  getLatestMatchingCall,
  // getSingleEntity,
} from "@sheenarbw/redux-django-rest-framework/src/apiEntities/selectors";

export class MainApp extends connect(store)(LitElement) {
  static get properties() {
    return {
      todoItems: { type: Array },
      lastListApiCall: { type: Object },
      lastCreateApiCall: { type: Object },
    };
  }

  constructor() {
    super();
    this.todoItems = [];
    this.createEntryName = "";
    this.lastListApiCall = { loading: true };
    this.lastCreateApiCall = { loading: false };
  }

  stateChanged(state) {
    this.todoItems = getEntityArray({ state, entityType: "todoItem" });
    console.log(state);
    this.lastListApiCall = getLatestMatchingCall({
      state,
      BASE_TYPE: "TODO_ITEM_LIST",
      // requestData: {},
    }) || { loading: true };
    this.lastCreateApiCall = getLatestMatchingCall({
      state,
      BASE_TYPE: "TODO_ITEM_CREATE",
      // requestData: {},
    }) || { loading: false };
  }

  preRender() {
    store.dispatch(
      apiReduxApps.TODO_ITEM_LIST.operations.maybeStart({
        data: {},
      })
    );
  }

  handleDeleteClicked({ id }) {
    store.dispatch(
      apiReduxApps.TODO_ITEM_DELETE.operations.maybeStart({
        data: { id },
      })
    );
  }

  handleInputUpdate(e) {
    this.createEntryName = e.target.value;
  }

  handleAddClicked() {
    store.dispatch(
      apiReduxApps.TODO_ITEM_CREATE.operations.start({
        data: { name: this.createEntryName },
      })
    );
  }

  handleToggleCheck({ e, item }) {
    e.preventDefault();
    store.dispatch(
      apiReduxApps.TODO_ITEM_UPDATE.operations.start({
        data: {
          ...item,
          done: !item.done,
        },
      })
    );
  }

  render() {
    // console.log(this.lastListApiCall);
    this.preRender();
    return html`
      <h1>TODO</h1>
      ${this.lastListApiCall.loading ? html`<h2>Loading...</h2>` : html``}
      <table>
        ${this.todoItems
          .sort((a, b) => a.done - b.done)
          .map(
            (item) =>
              html`
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      .checked=${item.done}
                      @click=${(e) => this.handleToggleCheck({ e, item })}
                    />
                    ${item.done ? html`<del>${item.name}</del>` : item.name}
                  </td>
                  <td>
                    <button
                      @click=${() => this.handleDeleteClicked({ id: item.id })}
                    >
                      X
                    </button>
                  </td>
                </tr>
              `
          )}
      </table>

      <h2>Create entry</h2>

      <input @change=${this.handleInputUpdate} />
      <button
        @click=${this.handleAddClicked}
        .disabled=${this.lastCreateApiCall.loading}
      >
        Add
      </button>
    `;
  }
}

customElements.define("main-app", MainApp);
