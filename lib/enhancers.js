"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withIndexedNodes = exports.withNode = exports.withoutNode = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ramda = _interopRequireDefault(require("ramda"));

var _reactRedux = require("react-redux");

var _recompose = require("recompose");

//#############################################################################
//# UTILS
//#############################################################################
var getNode = function getNode(nodeType, nodeId) {
  return _ramda.default.path(['NodeDB', 'nodes', nodeType, nodeId]);
};

var createNodeTypeFetcher = function createNodeTypeFetcher(nodeType) {
  return (0, _reactRedux.connect)(function (state, _ref) {
    var nodeId = _ref.nodeId;
    return (0, _defineProperty2.default)({}, nodeType, getNode(nodeType, nodeId)(state));
  });
};

var capitalize = function capitalize() {
  var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return _ramda.default.toUpper(_ramda.default.head(s)) + _ramda.default.tail(s);
};

var createIndexedNodeFetcher = function createIndexedNodeFetcher(nodeType, indexedPropName) {
  return (0, _reactRedux.connect)(function (state, _ref3) {
    var indexId = _ref3.indexId;
    return (0, _defineProperty2.default)({}, "indexed".concat(capitalize(nodeType), "Set"), _ramda.default.compose(_ramda.default.map(function (nodeId) {
      return getNode(nodeType, nodeId)(state);
    }), _ramda.default.pathOr([], ['NodeDB', 'indices', nodeType, indexedPropName, indexId]))(state));
  });
}; //#############################################################################
//# NODE SELECTORS
//#############################################################################


var withoutNode = function withoutNode(nodeType) {
  return (0, _recompose.mapProps)(_ramda.default.omit([nodeType]));
};

exports.withoutNode = withoutNode;

var withNode = function withNode(nodeType) {
  return (0, _recompose.compose)((0, _recompose.withProps)(function (props) {
    return {
      nodeId: props[nodeType + 'Id']
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