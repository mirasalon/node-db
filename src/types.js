// @flow
export type NodeId = string | number;

export type NodeType = string;

export type Node = {
  id: NodeId,
  nodeType: NodeType
};

export type NodeTable = {
  NodeId: Node
};

export type NodeSet = {
  [NodeType]: Array<Node>
};

export type NodeMap = {
  [NodeType]: NodeTable
};

export type IndexSpec = {
  [NodeType]: Array<NodeType>
};