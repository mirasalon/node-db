"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadImage = exports.deleteUGCPost = exports.createUGCPost = exports.reportUGC = exports.deleteUGCComment = exports.createUGCComment = exports.createPollResponse = exports.toggleUGCLike = exports.getPost = exports.getTopics = exports.getFeed = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _apisauce = require("apisauce");

var _endpoints = _interopRequireDefault(require("./endpoints"));

var _utils = require("./utils");

//#############################################################################
//# SETUP
//#############################################################################
var api = (0, _apisauce.create)({
  baseURL: _endpoints.default.communityServer,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json"
  }
}); // if (__DEV__) {
//   api.addMonitor(response =>
//     console.log("CommunityServer API Response: ", response)
//   );
// }
//#############################################################################
//# METHODS
//#############################################################################

var getFeed = function getFeed(topicId, offset) {
  return (0, _utils.authenticated)(api.get, "/feed/".concat(topicId), {
    page: offset
  });
};

exports.getFeed = getFeed;

var getTopics = function getTopics() {
  return (0, _utils.authenticated)(api.get, "/topics");
};

exports.getTopics = getTopics;

var getPost = function getPost(nodeId) {
  return (0, _utils.authenticated)(api.get, "/ugc/post/".concat(nodeId));
};

exports.getPost = getPost;

var toggleUGCLike = function toggleUGCLike(_ref) {
  var nodeId = _ref.nodeId,
      nodeType = _ref.nodeType,
      valence = _ref.valence;
  return (0, _utils.authenticated)(api.post, "/ugc/like", {
    nodeId: nodeId,
    nodeType: nodeType,
    valence: valence
  });
};

exports.toggleUGCLike = toggleUGCLike;

var createPollResponse = function createPollResponse(_ref2) {
  var nodeId = _ref2.nodeId,
      value = _ref2.value;
  return (0, _utils.authenticated)(api.post, "/ugc/poll_response", {
    nodeId: nodeId,
    value: value
  });
};

exports.createPollResponse = createPollResponse;

var createUGCComment = function createUGCComment(_ref3) {
  var commentId = _ref3.commentId,
      body = _ref3.body,
      parentId = _ref3.parentId,
      parentNodeType = _ref3.parentNodeType;
  return (0, _utils.authenticated)(api.post, "/ugc/comment", {
    commentId: commentId,
    body: body,
    parentId: parentId,
    parentNodeType: parentNodeType
  });
};

exports.createUGCComment = createUGCComment;

var deleteUGCComment = function deleteUGCComment(_ref4) {
  var commentId = _ref4.commentId,
      parentId = _ref4.parentId,
      parentNodeType = _ref4.parentNodeType;
  return (0, _utils.authenticated)(api.delete, "/ugc/comment", {
    commentId: commentId,
    parentId: parentId,
    parentNodeType: parentNodeType
  });
};

exports.deleteUGCComment = deleteUGCComment;

var reportUGC = function reportUGC(_ref5) {
  var id = _ref5.id,
      nodeId = _ref5.nodeId,
      nodeType = _ref5.nodeType;
  return (0, _utils.authenticated)(api.post, "/ugc/report", {
    id: id,
    nodeId: nodeId,
    nodeType: nodeType
  });
}; //#############################################################################
//# POSTING FLOW
//#############################################################################


exports.reportUGC = reportUGC;

var createUGCPost = function createUGCPost(_ref6) {
  var id = _ref6.id,
      title = _ref6.title,
      body = _ref6.body,
      _ref6$type = _ref6.type,
      type = _ref6$type === void 0 ? "text" : _ref6$type,
      pollOptions = _ref6.pollOptions,
      _ref6$imageIds = _ref6.imageIds,
      imageIds = _ref6$imageIds === void 0 ? [] : _ref6$imageIds,
      _ref6$topicIds = _ref6.topicIds,
      topicIds = _ref6$topicIds === void 0 ? [] : _ref6$topicIds,
      _ref6$linkUrl = _ref6.linkUrl,
      linkUrl = _ref6$linkUrl === void 0 ? null : _ref6$linkUrl,
      _ref6$productIds = _ref6.productIds,
      productIds = _ref6$productIds === void 0 ? [] : _ref6$productIds,
      _ref6$pollType = _ref6.pollType,
      pollType = _ref6$pollType === void 0 ? "text" : _ref6$pollType;
  return (0, _utils.authenticated)(api.post, "/ugc/post", (0, _objectSpread2.default)({
    id: id,
    type: type,
    title: title,
    body: body,
    imageIds: imageIds,
    topicIds: topicIds,
    productIds: productIds,
    linkUrl: linkUrl
  }, type === "poll" ? {
    pollType: pollType,
    pollOptions: pollOptions
  } : {}));
};

exports.createUGCPost = createUGCPost;

var deleteUGCPost = function deleteUGCPost(_ref7) {
  var id = _ref7.id;
  return (0, _utils.authenticated)(api.delete, "/ugc/post", {
    id: id
  });
}; //#############################################################################
//# CONTENT UPLOADS
//#############################################################################


exports.deleteUGCPost = deleteUGCPost;

var getFileType = function getFileType(uri) {
  var suffix = uri.split(".").slice(-1)[0].toLowerCase();
  if (suffix === "png") return "png";else return "jpeg";
};
/* Function: uploadImage
 * ---------------------
 * expects an imageUpload object
 */


var uploadImage = function uploadImage(_ref8) {
  var uri = _ref8.uri,
      fileType = _ref8.fileType,
      imageId = _ref8.imageId;

  // Get filetype
  if (!fileType) {
    fileType = getFileType(uri);
  } // Create form data


  var formData = new FormData();
  formData.append("image", {
    uri: uri,
    name: "photo.".concat(fileType),
    type: "image/".concat(fileType)
  });
  formData.append("imageId", imageId);
  var headers = {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
    Authorization: "Bearer ".concat((0, _utils.getToken)())
  }; // Upload

  return api.post(_endpoints.default.communityServer + "/ugc/image", formData, {
    headers: headers
  });
};

exports.uploadImage = uploadImage;