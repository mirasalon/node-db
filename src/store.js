// @flow
import { kea } from "kea";
import PropTypes from "prop-types";
import Immutable from "seamless-immutable";
import { createReducer, createActions } from "reduxsauce";
import R from "ramda";
import type { NodeId, NodeType, NodeSet } from "./types";

//#############################################################################
//# ACTIONS
//#############################################################################

const { Types, Creators } = createActions(
  {
    insert: ["nodes"],
    delete: ["nodeIds"]
  },
  { prefix: "NODEDB_" }
);

export const NodeDBTypes = Types;
export default Creators;

//#############################################################################
//# REDUCERS
//#############################################################################

//=====[ State type & initial state ]=====
export type NodeDBStateType = Immutable<{
  db: Immutable<{
    [NodeType]: Immutable<{
      [NodeId]: Immutable.object
    }>
  }>
}>;

const INITIAL_STATE: NodeDBStateType = Immutable.from({});

//=====[ Reducers ]=====
const insert = (state: NodeDBStateType, { nodes }: { nodes: NodeSet }) => {
  const allUpdates = {};
  R.keys(nodes).map(nodeType => {
    const formatted = {};
    nodes[nodeType].map(n => (formatted[n.id] = n));
    let table = state[nodeType] || Immutable.from({});
    table = table.merge(nodes, { deep: true });
    allUpdates[nodeType] = table;
  });
  return state.merge(allUpdates, { deep: true });
};

export const nodeDBReducer = createReducer(INITIAL_STATE, {
  [Types.INSERT]: insert
});
