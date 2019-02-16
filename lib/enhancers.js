"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withNode = exports.withoutNode = exports.multiNodeFetcher = void 0;

var R = _interopRequireWildcard(require("ramda"));

var _reactRedux = require("react-redux");

var _reselect = require("reselect");

var _reselect2 = require("./utils/reselect");

var _recompose = require("recompose");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//#############################################################################
//# UTILS
//#############################################################################
var omitProps = function omitProps(keys) {
  return (0, _recompose.mapProps)(function (props) {
    return R.omit(keys, props);
  });
};

var createStoreRetriever = function createStoreRetriever() {
  return (0, _reselect.createSelector)(function (_, nodeType) {
    return nodeType;
  }, function (state) {
    return R.path(["NodeDB"], state);
  }, function (type, db) {
    return R.path([type], db);
  });
};

var createValueRetriever = function createValueRetriever() {
  return (0, _reselect.createSelector)(function (_, __, nodeId) {
    return nodeId;
  }, createStoreRetriever(), function (id, store) {
    return R.path([id], store);
  });
};

var createIndexRetriever = function createIndexRetriever(storeRetriever) {
  return (0, _reselect.createSelector)(function (_, __, indexId) {
    return indexId;
  }, storeRetriever, function (indexId, store) {
    return R.pathOr([], ["_index", indexId], store);
  });
};

var createMemoizedIdsRetriever = function createMemoizedIdsRetriever() {
  return (0, _reselect2.createDeepEqualitySelector)(function (_, __, nodeIds) {
    return nodeIds;
  }, function (ids) {
    return ids;
  });
};

var hydrateNodes = function hydrateNodes(ids, store) {
  return ids.map(function (id) {
    return R.path([id], store);
  }).filter(function (x) {
    return x;
  });
};

var createMultiNodeRetriever = function createMultiNodeRetriever() {
  return (0, _reselect.createSelector)(createMemoizedIdsRetriever(), createStoreRetriever(), hydrateNodes);
};

var createIndexedNodesRetriever = function createIndexedNodesRetriever() {
  var storeRetriever = createStoreRetriever();
  return (0, _reselect.createSelector)(createIndexRetriever(storeRetriever), storeRetriever, hydrateNodes);
};

var nodeFetcher = (0, _reactRedux.connect)(function () {
  var valueRetriever = createValueRetriever();
  return function (state, _ref) {
    var nodeType = _ref.nodeType,
        nodeId = _ref.nodeId;
    return _defineProperty({}, nodeType, valueRetriever(state, nodeType, nodeId));
  };
});

var createNodeFetcher = function createNodeFetcher() {
  return (0, _reactRedux.connect)(function () {
    var valueRetriever = createValueRetriever();
    return function (state, _ref3) {
      var nodeType = _ref3.nodeType,
          nodeId = _ref3.nodeId;
      return _defineProperty({}, nodeType, valueRetriever(state, nodeType, nodeId));
    };
  });
};

var multiNodeFetcher = (0, _reactRedux.connect)(function () {
  var multiNodeRetriever = createMultiNodeRetriever();
  return function (state, _ref5) {
    var nodeType = _ref5.nodeType,
        nodeIds = _ref5.nodeIds;
    return _defineProperty({}, nodeType, multiNodeRetriever(state, nodeType, nodeIds));
  };
});
exports.multiNodeFetcher = multiNodeFetcher;
var multiIndexedNodeFetcher = (0, _reactRedux.connect)(function () {
  var indexedNodesRetriever = createIndexedNodesRetriever();
  return function (state, _ref7) {
    var nodeType = _ref7.nodeType,
        indexId = _ref7.indexId;
    return _defineProperty({}, nodeType, indexedNodesRetriever(state, nodeType, indexId));
  };
}); //#############################################################################
//# NODE SELECTORS
//#############################################################################

var withoutNode = function withoutNode(nodeType) {
  return omitProps([nodeType]);
};

exports.withoutNode = withoutNode;

var withNode = function withNode(nodeType) {
  return (0, _recompose.compose)((0, _recompose.withProps)(function (props) {
    return {
      nodeType: nodeType,
      nodeId: props[nodeType + "Id"]
    };
  }), createNodeFetcher());
};

exports.withNode = withNode;