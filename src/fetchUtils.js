import { getAuthToken } from "./authTokenStorage.js";

const _toCamel = (s) => {
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace("-", "").replace("_", "");
  });
};

const _isArray = function (a) {
  return Array.isArray(a);
};

const _isObject = function (o) {
  return o === Object(o) && !_isArray(o) && typeof o !== "function";
};

const fromSnakeToCamel = function (o) {
  if (_isObject(o)) {
    const n = {};

    Object.keys(o).forEach((k) => {
      n[_toCamel(k)] = fromSnakeToCamel(o[k]);
    });

    return n;
  } else if (_isArray(o)) {
    return o.map((i) => {
      return fromSnakeToCamel(i);
    });
  }

  return o;
};

const camelStringToSnake = function (s) {
  return s
    .replace(/(?:^|\.?)([A-Z])/g, function (x, y) {
      return "_" + y.toLowerCase();
    })
    .replace(/^_/, "");
};

export async function fetchAndClean({
  url,
  method,
  data,
  body,
  forceSuccessResponseJson,
  forceInitialHeaders,
  dontSendToken,
}) {
  const headers = forceInitialHeaders || {
    "Content-Type": "application/json",
  };
  const token = dontSendToken ? null : getAuthToken();
  if (token) headers.Authorization = `Token ${token}`;

  const params = {
    method: method || "GET",
    headers,
  };
  if (data) {
    const snakeData = {};
    Object.keys(data).forEach((key) => {
      snakeData[camelStringToSnake(key)] = data[key];
    });
    params["body"] = JSON.stringify(snakeData);
  }

  if (body) {
    params["body"] = body;
  }

  const response = await fetch(url, params);

  if (forceSuccessResponseJson) {
    return Promise.resolve({
      response,
      responseData: forceSuccessResponseJson,
    });
  }

  const responseData = await response.json();

  return Promise.resolve({
    response,
    responseData: fromSnakeToCamel(responseData),
  });
}

export function getNextPageNumberFromUrl({ url }) {
  if (url === null) return null;
  const urlInstance = new URL(url);
  const page = urlInstance.searchParams.get("page");
  return page;
}
