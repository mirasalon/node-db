import * as R from 'ramda';
import { NodeId, NodeType, Node, NodeSet, NodeMap } from '../types';

export const nodeSetToNodeMap = (nodeSet: NodeSet): NodeMap => {
  const nodeMap = {};
  R.keys(nodeSet).forEach(nodeType => {
    const nodes = nodeSet[nodeType];
    if (!nodes || !R.is(Array, nodes)) return;

    nodeMap[nodeType] = {};
    nodes.forEach(node => {
      nodeMap[nodeType][node.id] = node;
    });
  });
  return nodeMap;
};

export const sanitizeNodeType = nodeType => {
  // special case for image(s), ugcImage(s), search(es) FML
  if (nodeType.toLowerCase().includes('image'))
    return nodeType.replace(/s$/, '');
  if (nodeType.toLowerCase().includes('stories'))
    return nodeType.replace(/ies$/, 'y');
  else return nodeType.replace(/e?s$/, '');
};

// products => product, searches => search
export const sanitizeNodeMap = (nodeMap: NodeMap): NodeMap => {
  const output = {};
  R.keys(nodeMap).map(nodeType => {
    output[sanitizeNodeType(nodeType)] = nodeMap[nodeType];
  });
  return output;
};
