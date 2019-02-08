"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNodeIdListCacheSelector = exports.createDeepEqualitySelector = void 0;

var _reselect = require("reselect");

var R = _interopRequireWildcard(require("ramda"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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