// @flow
import Immutable from "seamless-immutable";
import { createReducer, createActions } from "reduxsauce";
import * as R from "ramda";
import type { NodeId, NodeType, NodeSet, NodeMap } from "./types";
import { nodeSetToNodeMap, sanitizeNodeMap } from "./utils/nodes";

//#############################################################################
//# ACTIONS
//#############################################################################

const { Types, Creators } = createActions(
  {
    insert: ["nodes"],
    remove: ["nodeType", "nodeIds"]
  },
  { prefix: "NODE_DB_" }
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
const insert = (
  state: NodeDBStateType,
  { nodes }: { nodes: NodeSet }
): NodeDBStateType => {
  let updates = nodeSetToNodeMap(nodes);
  updates = sanitizeNodeMap(updates);
  return state.merge(updates, { deep: true });
};

const remove = (
  state: NodeDBStateType,
  { nodeType, nodeIds }: { nodeType: NodeType, nodeIds: Array<NodeId> }
): NodeDBStateType => {
  if (!state[nodeType]) return state;
  return state.update(nodeType, x => x.without(nodeIds));
};

export const nodeDBReducer = createReducer(INITIAL_STATE, {
  [Types.INSERT]: insert,
  [Types.REMOVE]: remove
});
