import R from "ramda";
import { NodeId, NodeType, Node, NodeSet, NodeMap } from "../types";

export const nodeSetToNodeMap = (nodeSet: NodeSet): NodeMap => {
  const nodeMap = {};
  R.keys(nodeSet).forEach(nodeType => {
    const nodes = nodeSet[nodeType];

    if (!nodes || !R.is(Object, nodes)) return;

    if (!R.is(Array, nodes)) {
      nodeMap[nodeType] = nodes;
      return;
    }

    nodeMap[nodeType] = {};
    nodes.forEach(node => {
      nodeMap[nodeType][node.id] = node;
    });
  });
  return nodeMap;
};

export const sanitizeNodeType = nodeType => {
  const nodeTypeLower = nodeType.toLowerCase();

  // special case for image(s), ugcImage(s), article(s), search(es) FML
  if (nodeTypeLower.includes("image") || nodeTypeLower.includes("article"))
    return nodeType.replace(/s$/, "");
  if (nodeTypeLower.includes("stories")) return nodeType.replace(/ies$/, "y");
  else return nodeType.replace(/e?s$/, "");
};

// products => product, searches => search
export const sanitizeNodeMap = (nodeMap: NodeMap): NodeMap => {
  const output = {};
  R.keys(nodeMap).map(nodeType => {
    output[sanitizeNodeType(nodeType)] = nodeMap[nodeType];
  });
  return output;
};
