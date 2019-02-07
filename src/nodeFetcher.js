// @flow
import { connect } from "react-redux";

import { createSelector } from "reselect";
import { createDeepEqualitySelector } from "./utils/reselect";

import R from "ramda";

import { compose, mapProps, withProps } from "recompose";
import type { HOC } from "recompose";
import type { NodeId } from "./types";

import NodeDB from "./store";

//#############################################################################
//# UTILS
//#############################################################################

const omitProps = keys => mapProps(props => R.omit(keys, props));

const createStoreRetriever = () =>
  createSelector(
    (_, nodeType) => nodeType,
    state => R.path(["NodeDB"], state),
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

export default nodeFetcher;

//#############################################################################
//# NODE SELECTORS
//#############################################################################

export const withNode = (nodeType: string) =>
  compose(
    withProps(props => ({
      nodeType,
      nodeId: props[nodeType + "Id"]
    })),
    nodeFetcher
  );
export const withoutNode = (nodeType: string) => omitProps([nodeType]);

export const withProduct = withNode("product");
export const withoutProduct = withoutNode("product");
export const withBrand = withNode("brand");
export const withoutBrand = withoutNode("brand");
export const withArticle = withNode("article");
export const withoutArticle = withoutNode("article");
export const withInfluencer = withNode("influencer");
export const withoutInfluencer = withoutNode("influencer");
export const withReview = withNode("review");
export const withoutReview = withoutNode("review");
export const withVideo = withNode("video");
export const withoutVideo = withoutNode("video");
export const withImage = withNode("image");
export const withoutImage = withoutNode("image");
export const withVideoMention = withNode("videoMention");
export const withoutVideoMention = withoutNode("videoMention");
export const withUser = withNode("user");
export const withoutUser = withoutNode("user");
export const withUGCPost = withNode("ugcPost");
export const withoutUGCPost = withoutNode("ugcPost");
export const withUGCComment = withNode("ugcComment");
export const withoutUGCComment = withoutNode("ugcComment");
export const withUGCImage = withNode("ugcImage");
export const withoutUGCImage = withoutNode("ugcImage");