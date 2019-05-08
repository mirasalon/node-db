// @flow
import * as R from 'ramda';
import { type Node, type NodeTable, type NodeMap, type IndexSpec } from '../types';

type idProp = string;

const extractIndex = (indexIdProp: idProp) => (node: Node) => ({
  id: node.id, indexId: node[indexIdProp]
});

const reIndex = (nodes: NodeTable, indexIdProp: idProp) => R.compose(
  R.values,
  R.map(
    extractIndex(indexIdProp)
  ) 
)(nodes)

export const nodeTableToIndex = (nodes: NodeTable, indexIdProp: idProp) => R.reduceBy(
  (x, { id }) => x.concat(id),
  [],
  x => x.indexId,
  reIndex(nodes, indexIdProp)
)

export const nodeMapToIndex = (nodeMap: NodeMap, indexSpec: IndexSpec) => {
  const indexUpdates = {}
  R.keys(indexSpec).map(nodeType => {
    if (!(nodeType in nodeMap)) return;
    indexUpdates[nodeType] = {};
    for (const indexIdProp of indexSpec[nodeType]) {
      const updates = nodeTableToIndex(nodeMap[nodeType], indexIdProp)
      indexUpdates[nodeType][indexIdProp] = updates;
    }
  })
  return indexUpdates;
};