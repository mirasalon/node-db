"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.profilePhoto = exports.setOnboardingFlag = exports.updatePreferences = exports.addReaction = exports.getUserHistory = exports.getPosts = exports.getRecentActivity = exports.getSavedContent = exports.seenNotifications = exports.getNotifications = void 0;

var _apisauce = require("apisauce");

var _endpoints = _interopRequireDefault(require("./endpoints"));

var _utils = require("./utils");

var api = (0, _apisauce.create)({
  baseURL: _endpoints.default.profileServer,
  headers: {
    'Content-Type': 'application/json'
  }
}); // if (__DEV__) {
//   api.addMonitor(response =>
//     console.log('Profile Server Response: ', response)
//   );
// }

var getNotifications = function getNotifications() {
  return (0, _utils.authenticated)(api.get, '/notifications');
}; // notifications tab


exports.getNotifications = getNotifications;

var seenNotifications = function seenNotifications() {
  return (0, _utils.authenticated)(api.get, '/seen_notifications');
};

exports.seenNotifications = seenNotifications;

var getSavedContent = function getSavedContent() {
  return (0, _utils.authenticated)(api.get, '/saved_content');
}; // saved content tab (default)


exports.getSavedContent = getSavedContent;

var getRecentActivity = function getRecentActivity(userId) {
  return (0, _utils.authenticated)(api.get, "/activity/".concat(userId));
}; // personal posts tab


exports.getRecentActivity = getRecentActivity;

var getPosts = function getPosts(userId) {
  return (0, _utils.authenticated)(api.get, "/posts/".concat(userId));
}; // personal posts tab


exports.getPosts = getPosts;

var getUserHistory = function getUserHistory() {
  return (0, _utils.authenticated)(api.get, '/history');
};

exports.getUserHistory = getUserHistory;

var addReaction = function addReaction(nodeId, nodeType, reactionType, reactionValue) {
  return (0, _utils.authenticated)(api.post, "/reactions/".concat(nodeId), {
    nodeType: nodeType,
    reactionType: reactionType,
    reactionValue: reactionValue
  });
};

exports.addReaction = addReaction;

var updatePreferences = function updatePreferences(updates) {
  return (0, _utils.authenticated)(api.post, '/preferences', updates);
};

exports.updatePreferences = updatePreferences;

var setOnboardingFlag = function setOnboardingFlag(onboardingFlags) {
  return (0, _utils.authenticated)(api.post, '/app/settings', {
    onboardingFlags: onboardingFlags
  });
};

exports.setOnboardingFlag = setOnboardingFlag;

var getFileType = function getFileType(uri) {
  var suffix = uri.split('.').slice(-1)[0].toLowerCase();
  if (suffix === 'png') return 'png';else return 'jpeg';
};
/* Function: profilePhoto
 * ---------------------
 * expects an imageUpload object
 */


var profilePhoto = function profilePhoto(_ref) {
  var uri = _ref.uri,
      cropRect = _ref.cropRect;
  var fileType = getFileType(uri);
  var formData = new FormData();
  formData.append('photo', {
    uri: uri,
    name: "photo.".concat(fileType),
    type: "image/".concat(fileType)
  });
  formData.append('cropRect', cropRect);
  var headers = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data'
  };
  return (0, _utils.authenticated)(api.post, '/profile_photo', formData, headers);
};

exports.profilePhoto = profilePhoto;