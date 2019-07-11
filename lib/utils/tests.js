"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateNodeSet = exports.generateNode = exports.generateId = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var R = _interopRequireWildcard(require("ramda"));

var _lodash = _interopRequireDefault(require("lodash"));

var _types = require("../types");

var sampleNodeTypes = ['product', 'user', 'ugcImage', 'ugcPost', 'ugcComment', 'video', 'image', 'story'];

var generateId = function generateId() {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10) + '=';
};

exports.generateId = generateId;

var generateNode = function generateNode(nodeType, indexId1, indexId2) {
  return {
    id: generateId(),
    nodeType: nodeType,
    field1: generateId(),
    field2: generateId(),
    field3: generateId(),
    indexId1: indexId1 ? indexId1 : undefined,
    indexId2: indexId2 ? indexId2 : undefined
  };
}; // Keeps these constant through runs to ensure conflics across inserts


exports.generateNode = generateNode;
var indexId1s = [generateId(), generateId(), generateId()];
var indexId2s = [generateId(), generateId(), generateId()];

var generateNodeSet = function generateNodeSet() {
  var nodeType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  if (nodeType) return (0, _defineProperty2.default)({}, nodeType, _lodash.default.range(0, 10).map(function () {
    return generateNode(nodeType);
  }));else {
    var nodeSet = {};
    sampleNodeTypes.forEach(function (nodeType) {
      nodeSet[nodeType] = _lodash.default.range(0, 10).map(function () {
        var indexId1 = _lodash.default.sample(indexId1s);

        var indexId2 = _lodash.default.sample(indexId2s);

        return generateNode(nodeType, indexId1, indexId2);
      });
    });
    return nodeSet;
  }
};

exports.generateNodeSet = generateNodeSet;