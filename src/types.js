// @flow
export type NodeId = string | number;
export type NodeType = string;
export type Node = {
  id: NodeId,
  nodeType: NodeType
};
export type NodeSet = {
  [NodeType]: Array<Node>
};

export type NodeMap = {
  [NodeType]: {
    [NodeId]: Node
  }
};