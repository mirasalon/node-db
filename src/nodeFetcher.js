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

export const withProduct: HOC<
  { product: Object },
  { productId: NodeId }
> = compose(
  withProps(({ productId }) => ({
    nodeType: "product",
    nodeId: productId
  })),
  nodeFetcher
);

export const withoutProduct = omitProps(["product"]);

/*
export const withProductImages = compose(
  withProps(({ productId }) => ({
    nodeType: "image",
    indexId: productId
  })),
  multiIndexedNodeFetcher
);

export const withProductIngredients = compose(
  withProps(({ productId }) => ({
    nodeType: "ingredient",
    indexId: productId
  })),
  multiIndexedNodeFetcher
);

export const withBrand: HOC<{ brand: Object }, { brandId: NodeId }> = compose(
  withProps(({ brandId }) => ({
    nodeType: "brand",
    nodeId: brandId
  })),
  nodeFetcher
);

export const withoutBrand = omitProps(["brand"]);

export const withUser: HOC<{ user: Object }, { userId: NodeId }> = compose(
  withProps(({ userId }) => ({
    nodeType: "user",
    nodeId: userId
  })),
  nodeFetcher
);

export const withCurrentUserId: HOC<
  { auth: string, currentUserId: NodeId },
  *
> = connect(state => ({
  currentUserId: R.path(["auth", "userId"], state)
}));

export const withCurrentUser: HOC<{ user: Object }, *> = compose(
  withCurrentUserId,
  withProps(({ currentUserId: userId }) => ({ userId })),
  withUser
);

export const withoutUser = omitProps(["user"]);

export const withPost: HOC<{ ugcPost: UGCPost }, { postId: NodeId }> = compose(
  withProps(({ postId }) => ({
    nodeType: "ugcPost",
    nodeId: postId
  })),
  nodeFetcher
);

export const withoutPost = omitProps(["ugcPost"]);

export const withComment: HOC<
  { ugcComment: UGCComment },
  { commentId: NodeId }
> = compose(
  withProps(({ commentId }) => ({
    nodeType: "ugcComment",
    nodeId: commentId
  })),
  nodeFetcher
);

export const withoutComment = omitProps(["ugcComment"]);

export const withReview: HOC<
  { review: Object },
  { reviewId: NodeId }
> = compose(
  withProps(({ reviewId }) => ({
    nodeType: "review",
    nodeId: reviewId
  })),
  nodeFetcher
);

export const withArticle: HOC<
  { article: Object },
  { articleId: NodeId }
> = compose(
  withProps(({ articleId }) => ({
    nodeType: "article",
    nodeId: articleId
  })),
  nodeFetcher
);

export const withInfluencer: HOC<
  { influencer: Object },
  { influencerId: NodeId }
> = compose(
  withProps(({ influencerId }) => ({
    nodeType: "influencer",
    nodeId: influencerId
  })),
  nodeFetcher
);

export const withoutInfluencer = omitProps(["influencer"]);

export const withVideo: HOC<{ video: Object }, { videoId: NodeId }> = compose(
  withProps(({ videoId }) => ({
    nodeType: "video",
    nodeId: videoId
  })),
  nodeFetcher
);

export const withoutVideo = omitProps(["video"]);

export const withVideoMention: HOC<
  { mention: Object },
  { videoId: NodeId }
> = compose(
  withProps(({ videoId }) => ({
    nodeType: "mention",
    nodeId: videoId
  })),
  nodeFetcher
);

export const withoutVideoMention = omitProps(["mention"]);

export const withFeed: HOC<{ feed: Object }, { feedId: NodeId }> = compose(
  withProps(({ feedId }) => ({
    nodeType: "feed",
    nodeId: feedId
  })),
  nodeFetcher
);

export const withImage: HOC<
  { ugcImage: Object },
  { imageId: NodeId }
> = compose(
  withProps(({ imageId }) => ({
    nodeType: "ugcImage",
    nodeId: imageId
  })),
  nodeFetcher
);

export const withoutImage = omitProps(["ugcImage"]);

export const withSubgraph: HOC<
  { subgraph: Object },
  { subgraphId: NodeId }
> = compose(
  withProps(({ subgraphId }) => ({
    nodeType: "subgraph",
    nodeId: subgraphId
  })),
  nodeFetcher
);

export const withoutSubgraph = omitProps(["subgraph"]);
*/
