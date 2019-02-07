import R from "ramda";
import { NodeId, NodeType, Node, NodeSet, NodeMap } from "../types";

export const nodeSetToNodeMap = (nodeSet: NodeSet): NodeMap => {
  const nodeMap = {};
  R.keys(nodeSet).map(nodeType => {
    nodeMap[nodeType] = {};
    nodeSet[nodeType].map(node => {
      nodeMap[nodeType][node.id] = node;
    });
  });
  return nodeMap;
};

export const sanitizeNodeType = nodeType => nodeType.replace(/e?s$/, "");

// products => product, searches => search
export const sanitizeNodeMap = (nodeMap: NodeMap): NodeMap => {
  const output = {};
  R.keys(nodeMap).map(nodeType => {
    output[sanitizeNodeType(nodeType)] = nodeMap[nodeType];
  });
  return output;
};
