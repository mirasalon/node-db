"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNodeDBReducer = exports.nodeDBReducer = exports.default = exports.NodeDBTypes = void 0;

var _seamlessImmutable = _interopRequireDefault(require("seamless-immutable"));

var _reduxsauce = require("reduxsauce");

var R = _interopRequireWildcard(require("ramda"));

var _nodes = require("./utils/nodes");

var _indices = require("./utils/indices");

var _createReducer;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

console.log("HELLO WORLD"); //#############################################################################
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
  return _seamlessImmutable.default.from(_objectSpread({}, state, {
    nodes: state.nodes.update(nodeType, function (x) {
      return x.without(nodeIds);
    })
  }));
};

var nodeDBReducer = (0, _reduxsauce.createReducer)(INITIAL_STATE, (_createReducer = {}, _defineProperty(_createReducer, Types.INSERT, insert), _defineProperty(_createReducer, Types.REMOVE, remove), _createReducer)); //#############################################################################
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
  }), (_createReducer2 = {}, _defineProperty(_createReducer2, Types.INSERT, insert), _defineProperty(_createReducer2, Types.REMOVE, remove), _createReducer2));
};

exports.createNodeDBReducer = createNodeDBReducer;