"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadImage = exports.authenticated = exports.objToGetParams = exports.prepareGetParams = exports.getToken = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _lodash = _interopRequireDefault(require("lodash"));

var _ramda = require("ramda");

// TODO
// import { store } from '~/redux/store';
// export const getToken = () => path(['auth', 'accessToken'], store.getState());
var getToken = function getToken() {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NsYWltcyI6eyJ1c2VybmFtZSI6bnVsbCwiaWQiOjI1NjUsImF1dGgiOiJ1c2VyIn0sImp0aSI6IjIxNjk1ODM4LWM1OWUtNGI3OC1hYmNiLTJlZDk1ZTA0MTRlMiIsImV4cCI6MTg1MzcxMDYzMiwiZnJlc2giOmZhbHNlLCJpYXQiOjE1NDI2NzA2MzIsInR5cGUiOiJhY2Nlc3MiLCJuYmYiOjE1NDI2NzA2MzIsImlkZW50aXR5IjoyNTY1fQ.-Lfg5J9_o64p95EndtMBE-QeRJGEi8m7zoC057ApEQE";
};

exports.getToken = getToken;
var prepareGetParams = (0, _ramda.map)(function (value) {
  return (0, _ramda.is)(Array, value) ? JSON.stringify(value) : value;
});
exports.prepareGetParams = prepareGetParams;

var objToGetParams = function objToGetParams(obj) {
  return Object.entries(obj).map(function (_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];

    val = (0, _ramda.is)(Array, val) ? JSON.stringify(val) : val;
    if (val === null || val === undefined) return null;else return "".concat(key, "=").concat(val);
  }).filter(function (x) {
    return x;
  }).join("&");
};

exports.objToGetParams = objToGetParams;

var authenticated = function authenticated(call, route) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return call(route, params, {
    headers: (0, _objectSpread2.default)({}, headers, {
      Authorization: "Bearer ".concat(getToken())
    })
  });
};
/* Method: uploadImage
 * -------------------
 * - api: api created by apisauce
 * - endpoint: endpoint to actually hit
 * - uri: uri on the phone.
 * - path: path on the phone. either uri or path needs to not be undefined
 * - extraData: extra data to add to the upload form
 */


exports.authenticated = authenticated;

var uploadImage = function uploadImage(_ref3) {
  var api = _ref3.api,
      endpoint = _ref3.endpoint,
      uri = _ref3.uri,
      path = _ref3.path,
      extraData = _ref3.extraData;
  //=====[ Step 1: Get filetype ]=====
  var fileType = "jpg";

  if (path) {
    var pathParts = path.split(".");
    fileType = pathParts[pathParts.length - 1];
  } else if (uri) {
    var uriParts = uri.split(".");
    fileType = uriParts[uriParts.length - 1];
  } //=====[ Step 2: Format formData ]=====


  var formData = new FormData();
  formData.append("photo", {
    uri: path || uri,
    // NOTE: it looks like uri is the full-size one! path is cropped
    name: "photo.".concat(fileType),
    type: "image/".concat(fileType)
  });

  _lodash.default.keys(extraData).map(function (key) {
    formData.append(key, extraData[key]);
  }); //=====[ Step 3: Format headers ]=====


  var headers = {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
    Authorization: "Bearer ".concat(getToken())
  }; //=====[ Step 4: Fire off request ]=====

  return api.post(endpoint, formData, {
    headers: headers
  });
};

exports.uploadImage = uploadImage;