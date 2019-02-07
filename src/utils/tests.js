import R from "ramda";
import _ from "lodash";
import { NodeId, NodeType, Node, NodeSet, NodeMap } from "../types";

const sampleNodeTypes: Array<NodeType> = [
  "product",
  "user",
  "ugcImage",
  "ugcPost",
  "ugcComment",
  "video",
  "image",
  "ugcImage"
];

export const generateId = (): NodeId =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 10) + "=";

export const generateNode = (nodeType: NodeType): Node => ({
  id: generateId(),
  nodeType: nodeType,
  otherField: generateId()
});

export const generateNodeSet = (nodeType: NodeType = null): NodeSet => {
  if (nodeType)
    return {
      [nodeType]: _.range(0, 10).map(() => generateNode(nodeType))
    };
  else {
    let nodeSet = {};
    sampleNodeTypes.map(nodeType => {
      nodeSet[nodeType] = _.range(0, 10).map(() => generateNode(nodeType));
    });
    return nodeSet;
  }
};
