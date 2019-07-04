"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodeMapToIndex = exports.nodeTableToIndex = void 0;

var R = _interopRequireWildcard(require("ramda"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var extractIndex = function extractIndex(indexIdProp) {
  return function (node) {
    return {
      id: node.id,
      indexId: node[indexIdProp]
    };
  };
};

var reIndex = function reIndex(nodes, indexIdProp) {
  return R.compose(R.values, R.map(extractIndex(indexIdProp)))(nodes);
};

var nodeTableToIndex = function nodeTableToIndex(nodes, indexIdProp) {
  return R.reduceBy(function (x, _ref) {
    var id = _ref.id;
    return x.concat(id);
  }, [], function (x) {
    return x.indexId;
  }, reIndex(nodes, indexIdProp));
};

exports.nodeTableToIndex = nodeTableToIndex;

var nodeMapToIndex = function nodeMapToIndex(nodeMap, indexSpec) {
  var indexUpdates = {};
  R.keys(indexSpec).map(function (nodeType) {
    if (!(nodeType in nodeMap)) return;
    indexUpdates[nodeType] = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = indexSpec[nodeType][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var indexIdProp = _step.value;
        var updates = nodeTableToIndex(nodeMap[nodeType], indexIdProp);
        indexUpdates[nodeType][indexIdProp] = updates;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });
  return indexUpdates;
};

exports.nodeMapToIndex = nodeMapToIndex;