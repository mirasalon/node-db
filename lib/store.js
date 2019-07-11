"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNodeDBReducer = exports.nodeDBReducer = exports.default = exports.NodeDBTypes = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

require("@babel/polyfill");

var _seamlessImmutable = _interopRequireDefault(require("seamless-immutable"));

var _reduxsauce = require("reduxsauce");

var R = _interopRequireWildcard(require("ramda"));

var _nodes = require("./utils/nodes");

var _indices = require("./utils/indices");

var _createReducer;

//#############################################################################
//# ACTIONS
//#############################################################################
var _createActions = (0, _reduxsauce.createActions)({
  insert: ["nodes"],
  remove: ["nodeType", "nodeIds"]
}, {
  prefix: "NODE_DB_"
}),
    Types = _createActions.Types,
    Creators = _createActions.Creators;

var NodeDBTypes = Types;
exports.NodeDBTypes = NodeDBTypes;
var _default = Creators; //#############################################################################
//# STATE
//#############################################################################

exports.default = _default;

var INITIAL_STATE = _seamlessImmutable.default.from({
  nodes: {},
  indices: {},
  indexSpec: {}
}); //#############################################################################
//# REDUCERS
//#############################################################################
//=====[ Reducers ]=====


var insert = function insert(state, _ref) {
  var nodes = _ref.nodes;
  // =====[ DB ]=====
  var updates = (0, _nodes.nodeSetToNodeMap)(nodes);
  updates = (0, _nodes.sanitizeNodeMap)(updates); // =====[ INDICES ]=====

  var newIndices = (0, _indices.nodeMapToIndex)(updates, state.indexSpec);
  return state.merge({
    nodes: updates
  }, {
    deep: true
  }).update("indices", R.mergeDeepWith(R.concat, R.__, newIndices));
};

var remove = function remove(state, _ref2) {
  var nodeType = _ref2.nodeType,
      nodeIds = _ref2.nodeIds;
  if (!state.nodes[nodeType]) return state;
  return _seamlessImmutable.default.from((0, _objectSpread2.default)({}, state, {
    nodes: state.nodes.update(nodeType, function (x) {
      return x.without(nodeIds);
    })
  }));
};

var nodeDBReducer = (0, _reduxsauce.createReducer)(INITIAL_STATE, (_createReducer = {}, (0, _defineProperty2.default)(_createReducer, Types.INSERT, insert), (0, _defineProperty2.default)(_createReducer, Types.REMOVE, remove), _createReducer)); //#############################################################################
//# CREATION WITH INDICES
//#############################################################################
// Intention here is such that

exports.nodeDBReducer = nodeDBReducer;

var createNodeDBReducer = function createNodeDBReducer(indexSpec) {
  var _createReducer2;

  return (0, _reduxsauce.createReducer)(_seamlessImmutable.default.from({
    nodes: {},
    indices: {},
    indexSpec: indexSpec
  }), (_createReducer2 = {}, (0, _defineProperty2.default)(_createReducer2, Types.INSERT, insert), (0, _defineProperty2.default)(_createReducer2, Types.REMOVE, remove), _createReducer2));
};

exports.createNodeDBReducer = createNodeDBReducer;