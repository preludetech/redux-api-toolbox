import { fetchAndClean } from "../fetchUtils.js";
import { clearAuthToken,setAuthToken } from "../authTokenStorage.js";


function urlJoin({base, tail}){
  if (base.endsWith('/'))
    return `${base}${tail}`
  return `${base}/${tail}`
}


export async function login({REST_AUTH_BASE_URL, email, password }) {
  // const url = `${API_BASE_URL}/api/dj-rest-auth/login/`;
  console.assert(REST_AUTH_BASE_URL,"missing required argument: REST_AUTH_BASE_URL")
  const url = urlJoin({
    base: REST_AUTH_BASE_URL,
    tail: 'login/'
  })
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

export async function logout({REST_AUTH_BASE_URL}) {
  // const url = `${API_BASE_URL}/api/dj-rest-auth/logout/`;
  console.assert(REST_AUTH_BASE_URL,"missing required argument: REST_AUTH_BASE_URL")
  const url = urlJoin({
    base: REST_AUTH_BASE_URL,
    tail: 'logout/'
  })
  const { response, responseData } = await fetchAndClean({
    url,
    method: "POST",
  });
  clearAuthToken();
  return { response, responseData };
}

export async function requestPasswordReset({ REST_AUTH_BASE_URL,email }) {
  // const url = `${API_BASE_URL}/api/dj-rest-auth/password/reset/`;
  console.assert(REST_AUTH_BASE_URL,"missing required argument: REST_AUTH_BASE_URL")
  const url = urlJoin({
    base: REST_AUTH_BASE_URL,
    tail: 'password/reset/'
  })

  const { response, responseData } = await fetchAndClean({
    url,
    method: "POST",
    data: { email },
  });
  return { response, responseData };
}

export async function performPasswordReset({
  REST_AUTH_BASE_URL,
  token,
  uid,
  newPassword1,
  newPassword2,
}) {
  console.assert(REST_AUTH_BASE_URL,"missing required argument: REST_AUTH_BASE_URL")
  // const url = `${API_BASE_URL}/api/dj-rest-auth/password/reset/confirm/`;
  const url = urlJoin({
    base: REST_AUTH_BASE_URL,
    tail: 'password/reset/confirm/'
  })

  const { response, responseData } = await fetchAndClean({
    url,
    method: "POST",
    data: { token, uid, newPassword1, newPassword2 },
  });
  return { response, responseData };
}

export async function changePassword({ REST_AUTH_BASE_URL,newPassword1, newPassword2 }) {
  console.assert(REST_AUTH_BASE_URL,"missing required argument: REST_AUTH_BASE_URL")
  // const url = `${API_BASE_URL}/api/dj-rest-auth/password/change/`;
  const url = urlJoin({
    base: REST_AUTH_BASE_URL,
    tail: 'password/change/'
  })
  const { response, responseData } = await fetchAndClean({
    url,
    method: "POST",
    data: { newPassword1, newPassword2 },
  });
  return { response, responseData };
}
