"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitizeNodeMap = exports.sanitizeNodeType = exports.nodeSetToNodeMap = void 0;

var R = _interopRequireWildcard(require("ramda"));

var _types = require("../types");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var nodeSetToNodeMap = function nodeSetToNodeMap(nodeSet) {
  var nodeMap = {};
  R.keys(nodeSet).map(function (nodeType) {
    nodeMap[nodeType] = {};
    nodeSet[nodeType].map(function (node) {
      nodeMap[nodeType][node.id] = node;
    });
  });
  return nodeMap;
};

exports.nodeSetToNodeMap = nodeSetToNodeMap;

var sanitizeNodeType = function sanitizeNodeType(nodeType) {
  return nodeType.replace(/e?s$/, "");
}; // products => product, searches => search


exports.sanitizeNodeType = sanitizeNodeType;

var sanitizeNodeMap = function sanitizeNodeMap(nodeMap) {
  var output = {};
  R.keys(nodeMap).map(function (nodeType) {
    output[sanitizeNodeType(nodeType)] = nodeMap[nodeType];
  });
  return output;
};

exports.sanitizeNodeMap = sanitizeNodeMap;