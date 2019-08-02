"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withIndexedNodes = exports.withNode = exports.withoutNode = void 0;

var R = _interopRequireWildcard(require("ramda"));

var _reactRedux = require("react-redux");

var _recompose = require("recompose");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//#############################################################################
//# UTILS
//#############################################################################
var getNode = function getNode(nodeType, nodeId) {
  return R.path(["NodeDB", "nodes", nodeType, nodeId]);
};

var createNodeTypeFetcher = function createNodeTypeFetcher(nodeType) {
  return (0, _reactRedux.connect)(function (state, _ref) {
    var nodeId = _ref.nodeId;
    return _defineProperty({}, nodeType, getNode(nodeType, nodeId)(state));
  });
};

var capitalize = function capitalize() {
  var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  return R.toUpper(R.head(s)) + R.tail(s);
};

var createIndexedNodeFetcher = function createIndexedNodeFetcher(nodeType, indexedPropName) {
  return (0, _reactRedux.connect)(function (state, _ref3) {
    var indexId = _ref3.indexId;
    return _defineProperty({}, "indexed".concat(capitalize(nodeType), "Set"), R.compose(R.map(function (nodeId) {
      return getNode(nodeType, nodeId)(state);
    }), R.pathOr([], ["NodeDB", "indices", nodeType, indexedPropName, indexId]))(state));
  });
}; //#############################################################################
//# NODE SELECTORS
//#############################################################################


var withoutNode = function withoutNode(nodeType) {
  return (0, _recompose.mapProps)(R.omit([nodeType]));
};

exports.withoutNode = withoutNode;

var withNode = function withNode(nodeType) {
  return (0, _recompose.compose)((0, _recompose.withProps)(function (props) {
    return {
      nodeId: props[nodeType + "Id"]
    };
  }), createNodeTypeFetcher(nodeType));
};

exports.withNode = withNode;

var withIndexedNodes = function withIndexedNodes(nodeType, indexedPropName) {
  return (0, _recompose.compose)((0, _recompose.withProps)(function () {
    return {
      nodeType: nodeType,
      indexedPropName: indexedPropName
    };
  }), createIndexedNodeFetcher(nodeType, indexedPropName));
};

exports.withIndexedNodes = withIndexedNodes;