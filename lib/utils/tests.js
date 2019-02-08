"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateNodeSet = exports.generateNode = exports.generateId = void 0;

var _ramda = _interopRequireDefault(require("ramda"));

var _lodash = _interopRequireDefault(require("lodash"));

var _types = require("../types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sampleNodeTypes = ["product", "user", "ugcImage", "ugcPost", "ugcComment", "video", "image", "ugcImage"];

var generateId = function generateId() {
  return Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 10) + "=";
};

exports.generateId = generateId;

var generateNode = function generateNode(nodeType) {
  return {
    id: generateId(),
    nodeType: nodeType,
    otherField: generateId()
  };
};

exports.generateNode = generateNode;

var generateNodeSet = function generateNodeSet() {
  var nodeType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  if (nodeType) return _defineProperty({}, nodeType, _lodash.default.range(0, 10).map(function () {
    return generateNode(nodeType);
  }));else {
    var nodeSet = {};
    sampleNodeTypes.map(function (nodeType) {
      nodeSet[nodeType] = _lodash.default.range(0, 10).map(function () {
        return generateNode(nodeType);
      });
    });
    return nodeSet;
  }
};

exports.generateNodeSet = generateNodeSet;