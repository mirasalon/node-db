import R from "ramda";
import { NodeId, NodeType, Node, NodeSet, NodeMap } from "../types";

const nodeTypes: Array<NodeType> = ["product", "user", "ugcImage", "ugcPost"];

export const generateId = (): NodeId =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5) + "=";

export const generateNode = (nodeType: NodeType): Node => ({
  id: generateId(),
  nodeType: nodeType,
  otherField: generateId()
});

export const generateNodeSet = (nodeType: NodeType = null): NodeSet => {
  if (nodeType)
    return {
      [nodeType]: [1, 2, 3].map(() => generateNode(nodeType))
    };
  else {
    let nodeSet = {};
    nodeTypes.map(nodeType => {
      nodeSet[nodeType] = [1, 2, 3].map(() => generateNode(nodeType));
    });
    return nodeSet;
  }
};
