// @flow
import { compose, map, omit, pathOr, toUpper, head, tail, path } from "ramda";
import { connect } from "react-redux";
import { compose, mapProps, withProps } from "recompose";
import type { NodeType } from "./types";

//#############################################################################
//# UTILS
//#############################################################################
const getNode = (nodeType, nodeId) =>
  path(["NodeDB", "nodes", nodeType, nodeId]);

const createNodeTypeFetcher = (nodeType: NodeType) =>
  connect((state, { nodeId }) => ({
    [nodeType]: getNode(nodeType, nodeId)(state)
  }));

const capitalize = (s = "") => toUpper(head(s)) + tail(s);

const createIndexedNodeFetcher = (
  nodeType: NodeType,
  indexedPropName: string
) =>
  connect((state, { indexId }) => ({
    [`indexed${capitalize(nodeType)}Set`]: compose(
      map(nodeId => getNode(nodeType, nodeId)(state)),
      pathOr([], ["NodeDB", "indices", nodeType, indexedPropName, indexId])
    )(state)
  }));

//#############################################################################
//# NODE SELECTORS
//#############################################################################
export const withoutNode = (nodeType: string) => mapProps(omit([nodeType]));

export const withNode = (nodeType: NodeType) => {
  return compose(
    withProps(props => ({
      nodeId: props[nodeType + "Id"]
    })),
    createNodeTypeFetcher(nodeType)
  );
};

export const withIndexedNodes = (
  nodeType: NodeType,
  indexedPropName: string
) => {
  return compose(
    withProps(() => ({ nodeType, indexedPropName })),
    createIndexedNodeFetcher(nodeType, indexedPropName)
  );
};
