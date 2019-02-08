"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitizeNodeMap = exports.sanitizeNodeType = exports.nodeSetToNodeMap = void 0;

var _ramda = _interopRequireDefault(require("ramda"));

var _types = require("../types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nodeSetToNodeMap = function nodeSetToNodeMap(nodeSet) {
  var nodeMap = {};

  _ramda.default.keys(nodeSet).map(function (nodeType) {
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

  _ramda.default.keys(nodeMap).map(function (nodeType) {
    output[sanitizeNodeType(nodeType)] = nodeMap[nodeType];
  });

  return output;
};

exports.sanitizeNodeMap = sanitizeNodeMap;