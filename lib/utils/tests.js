"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateSparseNodeSet = exports.generateNodeDict = exports.generateNodeSet = exports.generateNode = exports.generateId = void 0;

var R = _interopRequireWildcard(require("ramda"));

var _lodash = _interopRequireDefault(require("lodash"));

var _types = require("../types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sampleNodeTypes = ["product", "user", "ugcImage", "ugcPost", "ugcComment", "video", "image", "story"];

var generateId = function generateId() {
  return Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 10) + "=";
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
  if (nodeType) return _defineProperty({}, nodeType, _lodash.default.range(0, 10).map(function () {
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

var generateNodeDict = function generateNodeDict() {
  var nodeType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  if (nodeType) return _defineProperty({}, nodeType, R.compose(R.reduce(function (acc, node) {
    return _objectSpread({}, acc, _defineProperty({}, node.id, node));
  }, {}), R.map(function () {
    return generateNode(nodeType, null, null);
  }))(R.range(0, 10)));else {
    var nodeSet = {};
    sampleNodeTypes.forEach(function (nodeType) {
      nodeSet[nodeType] = R.compose(R.reduce(function (acc, node) {
        return _objectSpread({}, acc, _defineProperty({}, node.id, node));
      }, {}), R.map(function () {
        return generateNode(nodeType, _lodash.default.sample(indexId1s), _lodash.default.sample(indexId2s));
      }))(R.range(0, 10));
    });
    return nodeSet;
  }
};

exports.generateNodeDict = generateNodeDict;

var generateSparseNodeSet = function generateSparseNodeSet() {
  var nodeType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  if (nodeType) return _defineProperty({}, nodeType, _lodash.default.range(0, 10).map(function (index) {
    return index % 3 ? generateNode(nodeType) : null;
  }));else {
    var nodeSet = {};
    sampleNodeTypes.forEach(function (nodeType) {
      nodeSet[nodeType] = _lodash.default.range(0, 10).map(function (index) {
        if (index % 3) {
          var indexId1 = _lodash.default.sample(indexId1s);

          var indexId2 = _lodash.default.sample(indexId2s);

          return generateNode(nodeType, indexId1, indexId2);
        }

        return null;
      });
    });
    return nodeSet;
  }
};

exports.generateSparseNodeSet = generateSparseNodeSet;