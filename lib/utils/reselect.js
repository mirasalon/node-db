"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNodeIdListCacheSelector = exports.createDeepEqualitySelector = void 0;

var _reselect = require("reselect");

var _ramda = _interopRequireDefault(require("ramda"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createDeepEqualitySelector = (0, _reselect.createSelectorCreator)(_reselect.defaultMemoize, _ramda.default.equals); // Returns true if they have the same ids

exports.createDeepEqualitySelector = createDeepEqualitySelector;

var nodeListEqual = function nodeListEqual(a, b) {
  return _ramda.default.equals(a.map(function (x) {
    return x.nodeId;
  }), b.map(function (x) {
    return x.nodeId;
  }));
};

var createNodeIdListCacheSelector = (0, _reselect.createSelectorCreator)(_reselect.defaultMemoize, nodeListEqual);
exports.createNodeIdListCacheSelector = createNodeIdListCacheSelector;