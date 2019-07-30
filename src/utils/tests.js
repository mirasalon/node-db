import * as R from "ramda";
import _ from "lodash";
import { NodeId, NodeType, Node, NodeSet, IndexSpec, NodeMap } from "../types";

const sampleNodeTypes: Array<NodeType> = [
  "product",
  "user",
  "ugcImage",
  "ugcPost",
  "ugcComment",
  "video",
  "image",
  "story"
];

export const generateId = (): NodeId =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 10) + "=";

export const generateNode = (
  nodeType: NodeType,
  indexId1: NodeId | null,
  indexId2: NodeId | null
): Node => ({
  id: generateId(),
  nodeType: nodeType,
  field1: generateId(),
  field2: generateId(),
  field3: generateId(),
  indexId1: indexId1 ? indexId1 : undefined,
  indexId2: indexId2 ? indexId2 : undefined
});

// Keeps these constant through runs to ensure conflics across inserts
const indexId1s = [generateId(), generateId(), generateId()];
const indexId2s = [generateId(), generateId(), generateId()];

export const generateNodeSet = (nodeType: NodeType = null): NodeSet => {
  if (nodeType)
    return {
      [nodeType]: _.range(0, 10).map(() => generateNode(nodeType))
    };
  else {
    let nodeSet = {};
    sampleNodeTypes.forEach(nodeType => {
      nodeSet[nodeType] = _.range(0, 10).map(() => {
        const indexId1 = _.sample(indexId1s);
        const indexId2 = _.sample(indexId2s);
        return generateNode(nodeType, indexId1, indexId2);
      });
    });
    return nodeSet;
  }
};
export const generateNodeDict = (nodeType: NodeType = null): NodeMap => {
  if (nodeType)
    return {
      [nodeType]: R.compose(
        R.reduce(
          (acc, node) => ({
            ...acc,
            [node.id]: node
          }),
          {}
        ),
        R.map(() => generateNode(nodeType, null, null))
      )(R.range(0, 10))
    };
  else {
    let nodeSet = {};
    sampleNodeTypes.forEach(nodeType => {
      nodeSet[nodeType] = R.compose(
        R.reduce(
          (acc, node) => ({
            ...acc,
            [node.id]: node
          }),
          {}
        ),
        R.map(() =>
          generateNode(nodeType, _.sample(indexId1s), _.sample(indexId2s))
        )
      )(R.range(0, 10));
    });
    return nodeSet;
  }
};
