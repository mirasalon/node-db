// @flow
import { kea } from "kea";
import PropTypes from "prop-types";
import Immutable from "seamless-immutable";
import { createReducer, createActions } from "reduxsauce";
import R from "ramda";
import type { NodeId, NodeType, NodeSet, NodeMap } from "./types";
import { nodeSetToNodeMap } from "./utils";

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
  const updates = nodeSetToNodeMap(nodes);
  return state.merge(updates, { deep: true });
};

export const nodeDBReducer = createReducer(INITIAL_STATE, {
  [Types.INSERT]: insert
});
