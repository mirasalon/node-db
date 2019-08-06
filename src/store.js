// @flow
import Immutable from "seamless-immutable";
import { createReducer, createActions } from "reduxsauce";
import * as R from "ramda";
import type { NodeId, NodeType, NodeSet, IndexSpec } from "./types";
import { nodeSetToNodeMap, sanitizeNodeMap } from "./utils/nodes";
import { nodeMapToIndex } from "./utils/indices";

console.log("HELLO WORLD");
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
//# STATE
//#############################################################################

export type NodeDBStateType = Immutable<{
  // RAW NODES
  nodes: Immutable<{
    [NodeType]: Immutable<{
      [NodeId]: Immutable.object
    }>
  }>,

  // INDICES
  indices: Immutable<{
    [NodeType]: Immutable<{
      [NodeType]: Immutable<{
        [NodeId]: Array<NodeId>
      }>
    }>
  }>,

  // INDICES SPEC
  indexSpec: Immutable<{
    [NodeType]: Immutable<Array<NodeType>>
  }>
}>;

const INITIAL_STATE: NodeDBStateType = Immutable.from({
  nodes: {},
  indices: {},
  indexSpec: {}
});

//#############################################################################
//# REDUCERS
//#############################################################################

//=====[ Reducers ]=====
const insert = (
  state: NodeDBStateType,
  { nodes }: { nodes: NodeSet }
): NodeDBStateType => {
  // =====[ DB ]=====
  let updates = nodeSetToNodeMap(nodes);
  updates = sanitizeNodeMap(updates);

  // =====[ INDICES ]=====
  const newIndices = nodeMapToIndex(updates, state.indexSpec);

  return state
    .merge({ nodes: updates }, { deep: true })
    .update("indices", R.mergeDeepWith(R.concat, R.__, newIndices));
};

const remove = (
  state: NodeDBStateType,
  { nodeType, nodeIds }: { nodeType: NodeType, nodeIds: Array<NodeId> }
): NodeDBStateType => {
  if (!state.nodes[nodeType]) return state;
  return Immutable.from({
    ...state,
    nodes: state.nodes.update(nodeType, x => x.without(nodeIds))
  });
};

export const nodeDBReducer = createReducer(INITIAL_STATE, {
  [Types.INSERT]: insert,
  [Types.REMOVE]: remove
});

//#############################################################################
//# CREATION WITH INDICES
//#############################################################################
// Intention here is such that

export const createNodeDBReducer = (indexSpec: IndexSpec) =>
  createReducer(
    Immutable.from({
      nodes: {},
      indices: {},
      indexSpec
    }),
    {
      [Types.INSERT]: insert,
      [Types.REMOVE]: remove
    }
  );
