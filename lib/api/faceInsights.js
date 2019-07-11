"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFaceInsights = void 0;

var _apisauce = require("apisauce");

var _endpoints = _interopRequireDefault(require("./endpoints"));

var _utils = require("./utils");

var api = (0, _apisauce.create)({
  baseURL: _endpoints.default.faceInsightsServer,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  }
}); // if (__DEV__) {
//   api.addMonitor(response =>
//     console.log('FaceInsightsServer API Response: ', response)
//   );
// }

var getFaceInsights = function getFaceInsights(imageBase64) {
  return (0, _utils.authenticated)(api.post, '/face_insights', {
    imageBase64: imageBase64,
    test: 'test'
  });
};

exports.getFaceInsights = getFaceInsights;