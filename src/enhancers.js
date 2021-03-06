// @flow
import * as R from "ramda";
import { connect as reduxConnect } from "react-redux";
import { compose, mapProps, withProps } from "recompose";
import type { NodeType } from "./types";

let connect = reduxConnect;

export const configureNodeDBEnhancer = (config = {}) => {
  if (config.connect) {
    connect = config.connect;
  }
}

//#############################################################################
//# UTILS
//#############################################################################
const getNode = (nodeType, nodeId) =>
  R.path(["NodeDB", "nodes", nodeType, nodeId]);

const createNodeTypeFetcher = (nodeType: NodeType) =>
  connect((state, { nodeId }) => ({
    [nodeType]: getNode(nodeType, nodeId)(state)
  }));

const capitalize = (s = "") => R.toUpper(R.head(s)) + R.tail(s);

const createIndexedNodeFetcher = (
  nodeType: NodeType,
  indexedPropName: string
) =>
  connect((state, { indexId }) => ({
    [`indexed${capitalize(nodeType)}Set`]: R.compose(
      R.map(nodeId => getNode(nodeType, nodeId)(state)),
      R.pathOr([], ["NodeDB", "indices", nodeType, indexedPropName, indexId])
    )(state)
  }));

//#############################################################################
//# NODE SELECTORS
//#############################################################################
export const withoutNode = (nodeType: string) => mapProps(R.omit([nodeType]));

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
