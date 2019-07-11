"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNodeIdListCacheSelector = exports.createDeepEqualitySelector = void 0;

var _reselect = require("reselect");

var R = _interopRequireWildcard(require("ramda"));

var createDeepEqualitySelector = (0, _reselect.createSelectorCreator)(_reselect.defaultMemoize, R.equals); // Returns true if they have the same ids

exports.createDeepEqualitySelector = createDeepEqualitySelector;

var nodeListEqual = function nodeListEqual(a, b) {
  return R.equals(a.map(function (x) {
    return x.nodeId;
  }), b.map(function (x) {
    return x.nodeId;
  }));
};

var createNodeIdListCacheSelector = (0, _reselect.createSelectorCreator)(_reselect.defaultMemoize, nodeListEqual);
exports.createNodeIdListCacheSelector = createNodeIdListCacheSelector;