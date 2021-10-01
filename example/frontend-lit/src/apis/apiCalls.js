import { fetchAndClean } from "@sheenarbw/redux-django-rest-framework/src/fetchUtils";
import { API_BASE_URL } from "../config";

export async function todoItemInstance({ id }) {
  const url = `${API_BASE_URL}/api/todo_items/${id}/`;
  const { response, responseData } = await fetchAndClean({ url });
  return { response, responseData };
}

export async function todoItemCreate({ name }) {
  const url = `${API_BASE_URL}/api/todo_items/`;
  const { response, responseData } = await fetchAndClean({
    url,
    method: "POST",
    data: {
      name,
      done: false,
    },
  });
  return { response, responseData };
}

export async function todoItemDelete({ id }) {
  const url = `${API_BASE_URL}/api/todo_items/${id}/`;
  const { response, responseData } = await fetchAndClean({
    url,
    method: "DELETE",
    forceSuccessResponseJson: { id },
  });
  return { response, responseData };
}

export async function todoItemList() {
  //TODO demonstrate paging
  const url = `${API_BASE_URL}/api/todo_items/`;
  const { response, responseData } = await fetchAndClean({ url });
  return { response, responseData };
}

export async function todoItemUpdate({ id, name, done }) {
  const url = `${API_BASE_URL}/api/todo_items/${id}/`;
  const { response, responseData } = await fetchAndClean({
    url,
    method: "PUT",
    data: {
      name,
      done,
    },
  });
  return { response, responseData };
}
