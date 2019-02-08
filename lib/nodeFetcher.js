"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withoutUGCImage = exports.withUGCImage = exports.withoutUGCComment = exports.withUGCComment = exports.withoutUGCPost = exports.withUGCPost = exports.withoutUser = exports.withUser = exports.withoutVideoMention = exports.withVideoMention = exports.withoutImage = exports.withImage = exports.withoutVideo = exports.withVideo = exports.withoutReview = exports.withReview = exports.withoutInfluencer = exports.withInfluencer = exports.withoutArticle = exports.withArticle = exports.withoutBrand = exports.withBrand = exports.withoutProduct = exports.withProduct = exports.withoutNode = exports.withNode = exports.default = exports.multiNodeFetcher = void 0;

var _reactRedux = require("react-redux");

var _reselect = require("reselect");

var _reselect2 = require("./utils/reselect");

var R = _interopRequireWildcard(require("ramda"));

var _recompose = require("recompose");

var _store = _interopRequireDefault(require("./store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//#############################################################################
//# UTILS
//#############################################################################
var omitProps = function omitProps(keys) {
  return (0, _recompose.mapProps)(function (props) {
    return R.omit(keys, props);
  });
};

var createStoreRetriever = function createStoreRetriever() {
  return (0, _reselect.createSelector)(function (_, nodeType) {
    return nodeType;
  }, function (state) {
    return R.path(["NodeDB"], state);
  }, function (type, db) {
    return R.path([type], db);
  });
};

var createValueRetriever = function createValueRetriever() {
  return (0, _reselect.createSelector)(function (_, __, nodeId) {
    return nodeId;
  }, createStoreRetriever(), function (id, store) {
    return R.path([id], store);
  });
};

var createIndexRetriever = function createIndexRetriever(storeRetriever) {
  return (0, _reselect.createSelector)(function (_, __, indexId) {
    return indexId;
  }, storeRetriever, function (indexId, store) {
    return R.pathOr([], ["_index", indexId], store);
  });
};

var createMemoizedIdsRetriever = function createMemoizedIdsRetriever() {
  return (0, _reselect2.createDeepEqualitySelector)(function (_, __, nodeIds) {
    return nodeIds;
  }, function (ids) {
    return ids;
  });
};

var hydrateNodes = function hydrateNodes(ids, store) {
  return ids.map(function (id) {
    return R.path([id], store);
  }).filter(function (x) {
    return x;
  });
};

var createMultiNodeRetriever = function createMultiNodeRetriever() {
  return (0, _reselect.createSelector)(createMemoizedIdsRetriever(), createStoreRetriever(), hydrateNodes);
};

var createIndexedNodesRetriever = function createIndexedNodesRetriever() {
  var storeRetriever = createStoreRetriever();
  return (0, _reselect.createSelector)(createIndexRetriever(storeRetriever), storeRetriever, hydrateNodes);
};

var nodeFetcher = (0, _reactRedux.connect)(function () {
  var valueRetriever = createValueRetriever();
  return function (state, _ref) {
    var nodeType = _ref.nodeType,
        nodeId = _ref.nodeId;
    return _defineProperty({}, nodeType, valueRetriever(state, nodeType, nodeId));
  };
});
var multiNodeFetcher = (0, _reactRedux.connect)(function () {
  var multiNodeRetriever = createMultiNodeRetriever();
  return function (state, _ref3) {
    var nodeType = _ref3.nodeType,
        nodeIds = _ref3.nodeIds;
    return _defineProperty({}, nodeType, multiNodeRetriever(state, nodeType, nodeIds));
  };
});
exports.multiNodeFetcher = multiNodeFetcher;
var multiIndexedNodeFetcher = (0, _reactRedux.connect)(function () {
  var indexedNodesRetriever = createIndexedNodesRetriever();
  return function (state, _ref5) {
    var nodeType = _ref5.nodeType,
        indexId = _ref5.indexId;
    return _defineProperty({}, nodeType, indexedNodesRetriever(state, nodeType, indexId));
  };
});
var _default = nodeFetcher; //#############################################################################
//# NODE SELECTORS
//#############################################################################

exports.default = _default;

var withNode = function withNode(nodeType) {
  return (0, _recompose.compose)((0, _recompose.withProps)(function (props) {
    return {
      nodeType: nodeType,
      nodeId: props[nodeType + "Id"]
    };
  }), nodeFetcher);
};

exports.withNode = withNode;

var withoutNode = function withoutNode(nodeType) {
  return omitProps([nodeType]);
};

exports.withoutNode = withoutNode;
var withProduct = withNode("product");
exports.withProduct = withProduct;
var withoutProduct = withoutNode("product");
exports.withoutProduct = withoutProduct;
var withBrand = withNode("brand");
exports.withBrand = withBrand;
var withoutBrand = withoutNode("brand");
exports.withoutBrand = withoutBrand;
var withArticle = withNode("article");
exports.withArticle = withArticle;
var withoutArticle = withoutNode("article");
exports.withoutArticle = withoutArticle;
var withInfluencer = withNode("influencer");
exports.withInfluencer = withInfluencer;
var withoutInfluencer = withoutNode("influencer");
exports.withoutInfluencer = withoutInfluencer;
var withReview = withNode("review");
exports.withReview = withReview;
var withoutReview = withoutNode("review");
exports.withoutReview = withoutReview;
var withVideo = withNode("video");
exports.withVideo = withVideo;
var withoutVideo = withoutNode("video");
exports.withoutVideo = withoutVideo;
var withImage = withNode("image");
exports.withImage = withImage;
var withoutImage = withoutNode("image");
exports.withoutImage = withoutImage;
var withVideoMention = withNode("videoMention");
exports.withVideoMention = withVideoMention;
var withoutVideoMention = withoutNode("videoMention");
exports.withoutVideoMention = withoutVideoMention;
var withUser = withNode("user");
exports.withUser = withUser;
var withoutUser = withoutNode("user");
exports.withoutUser = withoutUser;
var withUGCPost = withNode("ugcPost");
exports.withUGCPost = withUGCPost;
var withoutUGCPost = withoutNode("ugcPost");
exports.withoutUGCPost = withoutUGCPost;
var withUGCComment = withNode("ugcComment");
exports.withUGCComment = withUGCComment;
var withoutUGCComment = withoutNode("ugcComment");
exports.withoutUGCComment = withoutUGCComment;
var withUGCImage = withNode("ugcImage");
exports.withUGCImage = withUGCImage;
var withoutUGCImage = withoutNode("ugcImage");
exports.withoutUGCImage = withoutUGCImage;