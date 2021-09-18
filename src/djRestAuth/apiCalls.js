import { fetchAndClean } from "ajaxRedux/fetchUtils.js";
import { clearAuthToken } from "ajaxRedux/authTokenStorage.js";
import { API_BASE_URL } from "root/config.js";

export async function login({ email, password }) {
  const url = `${API_BASE_URL}/api/dj-rest-auth/login/`;
  const { response, responseData } = await fetchAndClean({
    url,
    method: "POST",
    data: {
      email,
      password,
    },
  });
  setAuthToken({ value: responseData.key, keep: true });
  return { response, responseData };
}

export async function whoAmI() {
  const url = `${API_BASE_URL}/api/core/who_am_i/`;
  const { response, responseData } = await fetchAndClean({ url });
  if (responseData.detail === "Invalid token.") clearAuthToken();
  return { response, responseData };
}

export async function logout() {
  const url = `${API_BASE_URL}/api/dj-rest-auth/logout/`;
  const { response, responseData } = await fetchAndClean({
    url,
    method: "POST",
  });
  clearAuthToken();
  return { response, responseData };
}

export async function requestPasswordReset({ email }) {
  const url = `${API_BASE_URL}/api/dj-rest-auth/password/reset/`;
  const { response, responseData } = await fetchAndClean({
    url,
    method: "POST",
    data: { email },
  });
  return { response, responseData };
}

export async function performPasswordReset({
  token,
  uid,
  newPassword1,
  newPassword2,
}) {
  const url = `${API_BASE_URL}/api/dj-rest-auth/password/reset/confirm/`;
  const { response, responseData } = await fetchAndClean({
    url,
    method: "POST",
    data: { token, uid, newPassword1, newPassword2 },
  });
  return { response, responseData };
}

export async function changePassword({ newPassword1, newPassword2 }) {
  const url = `${API_BASE_URL}/api/dj-rest-auth/password/change/`;
  const { response, responseData } = await fetchAndClean({
    url,
    method: "POST",
    data: { newPassword1, newPassword2 },
  });
  return { response, responseData };
}
