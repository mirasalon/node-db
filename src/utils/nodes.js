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
