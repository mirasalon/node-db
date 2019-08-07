"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitizeNodeMap = exports.sanitizeNodeType = exports.nodeSetToNodeMap = void 0;

var _ramda = require("ramda");

var _types = require("../types");

var nodeSetToNodeMap = function nodeSetToNodeMap(nodeSet) {
  var nodeMap = {};
  (0, _ramda.keys)(nodeSet).forEach(function(nodeType) {
    var nodes = nodeSet[nodeType];
    if (!nodes || !(0, _ramda.is)(Object, nodes)) return;

    if (!(0, _ramda.is)(Array, nodes)) {
      nodeMap[nodeType] = nodes;
      return;
    }

    nodeMap[nodeType] = {};
    nodes.forEach(function(node) {
      nodeMap[nodeType][node.id] = node;
    });
  });
  return nodeMap;
};

exports.nodeSetToNodeMap = nodeSetToNodeMap;

var sanitizeNodeType = function sanitizeNodeType(nodeType) {
  var nodeTypeLower = nodeType.toLowerCase(); // special case for image(s), ugcImage(s), article(s), search(es) FML

  if (nodeTypeLower.includes("image") || nodeTypeLower.includes("article"))
    return nodeType.replace(/s$/, "");
  if (nodeTypeLower.includes("stories")) return nodeType.replace(/ies$/, "y");
  else return nodeType.replace(/e?s$/, "");
}; // products => product, searches => search

exports.sanitizeNodeType = sanitizeNodeType;

var sanitizeNodeMap = function sanitizeNodeMap(nodeMap) {
  var output = {};
  (0, _ramda.keys)(nodeMap).map(function(nodeType) {
    output[sanitizeNodeType(nodeType)] = nodeMap[nodeType];
  });
  return output;
};

exports.sanitizeNodeMap = sanitizeNodeMap;
