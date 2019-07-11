import _ from "lodash";
import { map, is, path } from "ramda";

// TODO
// import { store } from '~/redux/store';
// export const getToken = () => path(['auth', 'accessToken'], store.getState());
export const getToken = () =>
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NsYWltcyI6eyJ1c2VybmFtZSI6bnVsbCwiaWQiOjI1NjUsImF1dGgiOiJ1c2VyIn0sImp0aSI6IjIxNjk1ODM4LWM1OWUtNGI3OC1hYmNiLTJlZDk1ZTA0MTRlMiIsImV4cCI6MTg1MzcxMDYzMiwiZnJlc2giOmZhbHNlLCJpYXQiOjE1NDI2NzA2MzIsInR5cGUiOiJhY2Nlc3MiLCJuYmYiOjE1NDI2NzA2MzIsImlkZW50aXR5IjoyNTY1fQ.-Lfg5J9_o64p95EndtMBE-QeRJGEi8m7zoC057ApEQE";

export const prepareGetParams = map(value =>
  is(Array, value) ? JSON.stringify(value) : value
);

export const objToGetParams = obj => {
  return Object.entries(obj)
    .map(([key, val]) => {
      val = is(Array, val) ? JSON.stringify(val) : val;
      if (val === null || val === undefined) return null;
      else return `${key}=${val}`;
    })
    .filter(x => x)
    .join("&");
};

export const authenticated = (call, route, params = {}, headers = {}) =>
  call(route, params, {
    headers: {
      ...headers,
      Authorization: `Bearer ${getToken()}`
    }
  });

/* Method: uploadImage
 * -------------------
 * - api: api created by apisauce
 * - endpoint: endpoint to actually hit
 * - uri: uri on the phone.
 * - path: path on the phone. either uri or path needs to not be undefined
 * - extraData: extra data to add to the upload form
 */
export const uploadImage = ({ api, endpoint, uri, path, extraData }) => {
  //=====[ Step 1: Get filetype ]=====
  let fileType = "jpg";
  if (path) {
    let pathParts = path.split(".");
    fileType = pathParts[pathParts.length - 1];
  } else if (uri) {
    let uriParts = uri.split(".");
    fileType = uriParts[uriParts.length - 1];
  }

  //=====[ Step 2: Format formData ]=====
  let formData = new FormData();
  formData.append("photo", {
    uri: path || uri, // NOTE: it looks like uri is the full-size one! path is cropped
    name: `photo.${fileType}`,
    type: `image/${fileType}`
  });
  _.keys(extraData).map(key => {
    formData.append(key, extraData[key]);
  });

  //=====[ Step 3: Format headers ]=====
  let headers = {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${getToken()}`
  };

  //=====[ Step 4: Fire off request ]=====
  return api.post(endpoint, formData, { headers });
};
