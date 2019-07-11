"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadProfilePhoto = exports.updatePreferences = void 0;

var _apisauce = require("apisauce");

var _config = _interopRequireDefault(require("~/config"));

var _utils = require("./utils");

var api = (0, _apisauce.create)({
  baseURL: endpoints.profileServer
}); // if (__DEV__) {
//   api.addMonitor(response => console.log('Got API Response: ', response));
// }

var updatePreferences = function updatePreferences(_ref) {
  var brands = _ref.brandPreferences,
      subcategories = _ref.subcategoryPreferences,
      skinTone = _ref.skinTone,
      undertone = _ref.undertone,
      eyeColor = _ref.eyeColor,
      skinType = _ref.skinType;
  return (0, _utils.authenticated)(api.post, '/preferences', {
    brands: brands,
    subcategories: subcategories,
    skinTone: skinTone,
    undertone: undertone,
    eyeColor: eyeColor,
    skinType: skinType
  });
};

exports.updatePreferences = updatePreferences;

var uploadProfilePhoto = function uploadProfilePhoto(_ref2) {
  var uri = _ref2.uri,
      path = _ref2.path;
  return (0, _utils.uploadImage)({
    api: api,
    endpoint: '/profile_photo',
    uri: uri,
    path: path,
    extraData: {}
  });
};

exports.uploadProfilePhoto = uploadProfilePhoto;