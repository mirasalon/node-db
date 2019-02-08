"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodeDBReducer = exports.default = exports.NodeDBTypes = void 0;

var _seamlessImmutable = _interopRequireDefault(require("seamless-immutable"));

var _reduxsauce = require("reduxsauce");

var _ramda = _interopRequireDefault(require("ramda"));

var _nodes = require("./utils/nodes");

var _createReducer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# REDUCERS
//#############################################################################
//=====[ State type & initial state ]=====

exports.default = _default;

var INITIAL_STATE = _seamlessImmutable.default.from({}); //=====[ Reducers ]=====


var insert = function insert(state, _ref) {
  var nodes = _ref.nodes;
  var updates = (0, _nodes.nodeSetToNodeMap)(nodes);
  updates = (0, _nodes.sanitizeNodeMap)(updates);
  return state.merge(updates, {
    deep: true
  });
};

var remove = function remove(state, _ref2) {
  var nodeType = _ref2.nodeType,
      nodeIds = _ref2.nodeIds;
  if (!state[nodeType]) return state;
  return state.update(nodeType, function (x) {
    return x.without(nodeIds);
  });
};

var nodeDBReducer = (0, _reduxsauce.createReducer)(INITIAL_STATE, (_createReducer = {}, _defineProperty(_createReducer, Types.INSERT, insert), _defineProperty(_createReducer, Types.REMOVE, remove), _createReducer));
exports.nodeDBReducer = nodeDBReducer;