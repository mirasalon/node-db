// @flow
import * as R from "ramda";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { createDeepEqualitySelector } from "./utils/reselect";
import { compose, mapProps, withProps } from "recompose";
import type { HOC } from "recompose";
import type { NodeId, NodeType } from "./types";

//#############################################################################
//# UTILS
//#############################################################################

const omitProps = keys => mapProps(props => R.omit(keys, props));

const createStoreRetriever = () =>
  createSelector(
    (_, nodeType) => nodeType,
    state => R.path(["NodeDB", "nodes"], state),
    (type, db) => R.path([type], db)
  );

const createValueRetriever = () =>
  createSelector(
    (_, __, nodeId) => nodeId,
    createStoreRetriever(),
    (id, store) => R.path([id], store)
  );

const createIndexRetriever = storeRetriever =>
  createSelector(
    (_, __, indexId) => indexId,
    storeRetriever,
    (indexId, store) => R.pathOr([], ["_index", indexId], store)
  );

const createMemoizedIdsRetriever = () =>
  createDeepEqualitySelector((_, __, nodeIds) => nodeIds, ids => ids);

const hydrateNodes = (ids, store) =>
  ids.map(id => R.path([id], store)).filter(x => x);

const createMultiNodeRetriever = () =>
  createSelector(
    createMemoizedIdsRetriever(),
    createStoreRetriever(),
    hydrateNodes
  );

const createIndexedNodesRetriever = () => {
  const storeRetriever = createStoreRetriever();

  return createSelector(
    createIndexRetriever(storeRetriever),
    storeRetriever,
    hydrateNodes
  );
};

const nodeFetcher = connect(() => {
  const valueRetriever = createValueRetriever();

  return (state, { nodeType, nodeId }) => {
    return { [nodeType]: valueRetriever(state, nodeType, nodeId) };
  };
});

const createNodeFetcher = () =>
  connect(() => {
    const valueRetriever = createValueRetriever();

    return (state, { nodeType, nodeId }) => {
      return { [nodeType]: valueRetriever(state, nodeType, nodeId) };
    };
  });

export const multiNodeFetcher = connect(() => {
  const multiNodeRetriever = createMultiNodeRetriever();

  return (state, { nodeType, nodeIds }) => ({
    [nodeType]: multiNodeRetriever(state, nodeType, nodeIds)
  });
});

const multiIndexedNodeFetcher = connect(() => {
  const indexedNodesRetriever = createIndexedNodesRetriever();

  return (state, { nodeType, indexId }) => ({
    [nodeType]: indexedNodesRetriever(state, nodeType, indexId)
  });
});

//#############################################################################
//# NODE SELECTORS
//#############################################################################

export const withoutNode = (nodeType: string) => omitProps([nodeType]);

export const withNode = (nodeType: NodeType) => {
  return compose(
    withProps(props => ({
      nodeType,
      nodeId: props[nodeType + "Id"]
    })),
    createNodeFetcher()
  );
};

//#############################################################################
//# INDICES
//#############################################################################

// TODO: MURILLO, HELP ME HERE!
export const withProductImages = compose(
  withProps(({ productId }) => ({
    nodeType: 'image',
    indexId: productId
  })),
  multiIndexedNodeFetcher
);