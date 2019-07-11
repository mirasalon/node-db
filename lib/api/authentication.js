"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkVersionUpdate = exports.socialLogin = exports.getFBProfile = exports.getCurrentAccessToken = exports.getFBPermission = void 0;

var _apisauce = require("apisauce");

var _endpoints = _interopRequireDefault(require("endpoints"));

var _reactNativeFbsdk = require("react-native-fbsdk");

var api = (0, _apisauce.create)({
  baseURL: _endpoints.default.authServer
});
var fbApi = (0, _apisauce.create)({
  baseURL: _endpoints.default.fbAPI
});

// if (__DEV__) {
//   api.addMonitor(response => console.log('Authentication API Response: ', response));
// }
//==========[ SOCIAL SIGNUP ]==========
var getFBPermission = function getFBPermission() {
  _reactNativeFbsdk.LoginManager.logOut();

  return _reactNativeFbsdk.LoginManager.logInWithReadPermissions(['public_profile', 'email']);
};

exports.getFBPermission = getFBPermission;

var getCurrentAccessToken = function getCurrentAccessToken() {
  _reactNativeFbsdk.AccessToken.getCurrentAccessToken.then(function (data) {
    return data.accessToken.toString();
  });
};

exports.getCurrentAccessToken = getCurrentAccessToken;

var getFBProfile = function getFBProfile() {
  return new Promise(function (resolve) {
    var infoRequest = new _reactNativeFbsdk.GraphRequest('/me', {
      parameters: {
        fields: {
          string: 'email,name'
        }
      }
    }, function (error, result) {
      resolve({
        error: error,
        result: result
      });
    });
    return new _reactNativeFbsdk.GraphRequestManager().addRequest(infoRequest).start();
  });
};

exports.getFBProfile = getFBProfile;

var socialLogin = function socialLogin(name, socialId, email, socialProvider, appCenterDeviceId) {
  return api.post('/login/social', {
    name: name,
    socialId: socialId,
    email: email,
    socialProvider: socialProvider,
    appCenterDeviceId: appCenterDeviceId
  });
};

exports.socialLogin = socialLogin;

var checkVersionUpdate = function checkVersionUpdate(version) {
  return api.get('/version_blocker', {
    version: version
  });
};

exports.checkVersionUpdate = checkVersionUpdate;