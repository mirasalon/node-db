"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitizeNodeMap = exports.sanitizeNodeType = exports.nodeSetToNodeMap = void 0;

var R = _interopRequireWildcard(require("ramda"));

var _types = require("../types");

var nodeSetToNodeMap = function nodeSetToNodeMap(nodeSet) {
  var nodeMap = {};
  R.keys(nodeSet).forEach(function (nodeType) {
    var nodes = nodeSet[nodeType];
    if (!nodes || !R.is(Array, nodes)) return;
    nodeMap[nodeType] = {};
    nodes.forEach(function (node) {
      nodeMap[nodeType][node.id] = node;
    });
  });
  return nodeMap;
};

exports.nodeSetToNodeMap = nodeSetToNodeMap;

var sanitizeNodeType = function sanitizeNodeType(nodeType) {
  // special case for image(s), ugcImage(s), search(es) FML
  if (nodeType.toLowerCase().includes('image')) return nodeType.replace(/s$/, '');
  if (nodeType.toLowerCase().includes('stories')) return nodeType.replace(/ies$/, 'y');else return nodeType.replace(/e?s$/, '');
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