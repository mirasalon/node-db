// @flow
import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";

import { NodeId, NodeType } from "../types";
import { generateId } from "../utils/ids";

//=====[ Actions ]=====
const { Types, Creators } = createActions(
  {
    // EDITING / CREATING
    initComment: ["parentId", "parentNodeType", "commentId"],
    setCommentData: ["data"],

    //IMAGES
    requestLibraryImages: null,
    receiveImages: ["images"],

    setProduct: ["productId"],

    addTag: ["tag"],
    updateText: ["text"],

    addImage: ["imageId"],
    removeImage: ["imageId"],

    tagProduct: ["imageId", "productId"],
    untagProduct: ["imageId", "productId"],

    resetMode: null,
    setMode: ["mode", "id"],

    updateLinkText: ["update"],

    // FINAL STEP
    updateSubmitStatus: ["status"],
    finishComment: null,
    resetData: null
  },
  { prefix: "COMMENT_CREATION_" }
);

export const CommentCreationTypes = Types;
export default Creators;

//=====[ Reducers ]=====
// 1. Type Definitions
export type CommentCreationStateType = Immutable<{
  id: NodeId,

  suggestedImageData: Object[],

  textContent: {
    tags: { nodeType: NodeType, nodeId: NodeId, label: string }[],
    rawText: ""
  },

  selectedImages: NodeId[],
  images: {
    [imageId: NodeId]: {
      // Image Properties. Tagged product ids, tag location, etc
      productIds: NodeId[]
    }
  },

  linkUrl: string | null,

  productId: string | null,

  gifId: string | null,

  submitStatus: "loading" | "done" | "error" | "none"
}>;

// 2. Initial State
const INITIAL_STATE: CommentCreationStateType = Immutable.from({
  id: null,
  parentId: null,
  parentNodeType: null,

  suggestedImageData: [],

  textContent: {
    tags: [],
    rawText: ""
  },

  selectedImages: null,
  images: {},

  linkUrl: null,
  productId: "",
  gifId: null,

  submitStatus: "none"
});

// 3. Reducing functions
const initComment = (
  state: CommentCreationStateType,
  { parentId, parentNodeType, commentId }
) =>
  state
    .set("id", commentId || generateId())
    .set("parentId", parentId)
    .set("parentNodeType", parentNodeType);

const setCommentData = (state: CommentCreationStateType, { data }) =>
  state.merge(data);

const updateText = (state: CommentCreationStateType, { text }) =>
  state
    .setIn(["textContent", "rawText"], text)
    .update("selectedImages", images =>
      images != null && images.length === 0 ? null : images
    );

const addTag = (state: CommentCreationStateType, { tag }) =>
  state.updateIn(["textContent", "tags"], R.append(tag));

const addImage = (state: CommentCreationStateType, { imageId }) =>
  state
    .setIn(["images", imageId], {
      productIds: []
    })
    .update("selectedImages", R.append(imageId));

const removeImage = (state: CommentCreationStateType, { imageId }) =>
  state
    .update("images", R.omit([imageId]))
    .update("selectedImages", R.without(imageId));

const tagProduct = (state: CommentCreationStateType, { imageId, productId }) =>
  state.updateIn(["images", imageId, "productIds"], R.append(productId));

const untagProduct = (
  state: CommentCreationStateType,
  { imageId, productId }
) => state.updateIn(["images", imageId, "productIds"], R.without(productId));

const receiveImages = (
  state: CommentCreationStateType,
  { images }: { images: Object[] }
) => state.merge({ suggestedImageData: images });

const setProductId = (
  state: CommentCreationStateType,
  { productId }: { productId: NodeId }
) => state.set("productId", productId);

const RESET_MODE = {
  selectedImages: null,
  images: {},

  linkUrl: null,
  gifId: null,
  productId: null
};

const setMode = (
  state: CommentCreationStateType,
  {
    mode,
    id
  }: { mode: "link" | "gif" | "product" | "image" | "text", id?: string }
) => {
  switch (mode) {
    case "link":
      return state.merge({
        ...RESET_MODE,
        linkUrl: ""
      });
    case "gif":
      return state.merge({
        ...RESET_MODE,
        gifId: id
      });
    case "product":
      return state.merge({
        ...RESET_MODE,
        productId: id
      });
    case "image":
      return state.merge({
        ...RESET_MODE,
        selectedImages: []
      });
    default:
      return state.merge(RESET_MODE);
  }
};

const resetMode = (state: CommentCreationStateType) => state.merge(RESET_MODE);

const updateLinkText = (
  state: CommentCreationStateType,
  { update }: { update: string }
) => state.set("linkUrl", update);

//TOPIC PAGE
const updateSubmitStatus = (
  state: CommentCreationStateType,
  { status }: { status: string }
) => state.merge({ submitStatus: status });

const resetData = () => INITIAL_STATE;

// 4. Hook Actions and Reducers together
export const commentCreationReducer = createReducer(INITIAL_STATE, {
  [Types.INIT_COMMENT]: initComment,
  [Types.SET_COMMENT_DATA]: setCommentData,

  [Types.SET_PRODUCT]: setProductId,

  [Types.RECEIVE_IMAGES]: receiveImages,

  [Types.UPDATE_TEXT]: updateText,
  [Types.ADD_TAG]: addTag,

  [Types.ADD_IMAGE]: addImage,
  [Types.REMOVE_IMAGE]: removeImage,

  [Types.TAG_PRODUCT]: tagProduct,
  [Types.UNTAG_PRODUCT]: untagProduct,

  [Types.RESET_MODE]: resetMode,
  [Types.SET_MODE]: setMode,

  [Types.UPDATE_LINK_TEXT]: updateLinkText,

  [Types.UPDATE_SUBMIT_STATUS]: updateSubmitStatus,

  [Types.RESET_DATA]: resetData
});

//=====[ Selectors ]=====
import * as R from "ramda";

import { createSelector } from "reselect";

const EMPTY_LIST = [];

type CommentCreationPartialState = {
  commentCreation: CommentCreationStateType
};

const commentCreationModeSelector = ({
  commentCreation: { linkUrl, gifId, productId, selectedImages }
}: CommentCreationPartialState) => {
  if (linkUrl != null) return "link";
  if (gifId != null) return "gif";
  if (productId != null) return "product";
  if (selectedImages != null) return "image";
  return "text";
};

const hasContributedContentSelector = createSelector(
  commentCreationModeSelector,
  ({ commentCreation: { linkUrl, gifId, productId, selectedImages } }) => ({
    linkUrl,
    gifId,
    productId,
    selectedImages
  }),
  (mode, { linkUrl, gifId, productId, selectedImages }) => {
    switch (mode) {
      case "link":
        return linkUrl !== "";

      case "gif":
        return gifId !== "";

      case "product":
        return productId !== "";

      case "image":
        return selectedImages.length > 0;

      case "text":
        return false;
    }
  }
);

export const commentCreationSelectors = {
  id: R.pathOr(null, ["commentCreation", "id"]),
  suggestedImages: R.pathOr(EMPTY_LIST, [
    "commentCreation",
    "suggestedImageData"
  ]),
  images: R.pathOr(EMPTY_LIST, ["commentCreation", "selectedImages"]),

  tags: R.pathOr(EMPTY_LIST, ["commentCreation", "textContent", "tags"]),
  text: R.pathOr(EMPTY_LIST, ["commentCreation", "textContent", "rawText"]),

  taggedProducts: (state: CommentCreationPartialState, imageId: NodeId) =>
    R.pathOr(
      EMPTY_LIST,
      ["commentCreation", "images", "" + imageId, "productIds"],
      state
    ),

  linkUrl: R.pathOr(EMPTY_LIST, ["commentCreation", "linkUrl"]),

  productId: R.pathOr(EMPTY_LIST, ["commentCreation", "productId"]),

  gifId: R.pathOr(EMPTY_LIST, ["commentCreation", "gifId"]),

  commentCreationMode: commentCreationModeSelector,
  hasContributedContent: hasContributedContentSelector,

  submitStatus: R.pathOr(null, ["commentCreation", "submitStatus"])
};

//=====[ Sagas ]=====
import { all, takeLatest, call, put, select } from "redux-saga/effects";

import { finishComment as finishCommentAPI } from "../api/community";

import { store } from "redux";
// import { parseBody } from '@redux/postCreation';

// 1. Defining Workers
function* requestImages(): Generator<any, void, any> {
  const images = unwrapImages(yield call(getPhotos));

  yield put(Creators.receiveImages(images));
}

/* Worker: finishComment
 * ---------------------
 * Submits a comment to the backend
 */
function* finishComment(): Generator<any, void, any> {
  yield put(Creators.updateSubmitStatus("loading"));

  // TODO
  const {
    commentCreation: {
      id,
      parentId,
      parentNodeType,
      productId,
      gifId,
      images,
      linkUrl,
      textContent,
      selectedImages
    }
  } = yield select();

  const formattedData = {
    id,
    productIds: productId ? [productId] : [],
    textContent,
    gifs: gifId ? [gifId] : [],
    imageIds: selectedImages ? selectedImages : [],
    imageData: images,
    linkUrls: linkUrl ? [linkUrl] : [],
    parentId,
    parentNodeType
  };
  const { ok, data } = yield call(finishCommentAPI, formattedData);

  if (!ok) {
    yield put(Creators.updateSubmitStatus({ status: "error" }));
    console.warn("error, could not finish comment", data);
  } else {
    yield put(Creators.updateSubmitStatus({ status: "done" }));
    yield put(Creators.resetMode());
    yield put(Creators.updateText(""));
  }
}

/* Worker: loadCommentData
 * -----------------------
 * Loads in a comment by `ugcCommentId` from NodeDB. Used in editing existing comments.
 * This does nothing if the comment doesn't exist yet.
 */
function* loadCommentData({ commentId }): Generator<any, void, any> {
  if (commentId == null) return;

  const state = yield select();
  const comment = R.path(["NodeDB", "ugcComment", commentId], state);
  if (comment) {
    const {
      body,
      gifs,
      image_data: images,
      image_ids: selectedImages,
      link_urls: urls,
      product_ids: productIds,
      parent_node_type: parentNodeType,
      parent_id: parentId
    } = comment;
    yield put(
      Creators.setCommentData({
        textContent: parseBody(body),
        selectedImages,
        images,
        parentId,
        parentNodeType,
        productId: productIds && productIds.length > 0 ? productIds[0] : null,
        gifId: gifs.length > 0 ? gifs[0] : null,
        linkUrl: urls.length > 0 ? urls[0] : null
      })
    );
  }
}

// 2. Putting Sagas and Actions together
export function* commentCreationSagas(): Generator<any, void, any> {
  yield all([takeLatest(Types.INIT_COMMENT, loadCommentData)]);
  yield all([takeLatest(Types.REQUEST_LIBRARY_IMAGES, requestImages)]);
  yield all([takeLatest(Types.FINISH_COMMENT, finishComment)]);
}

// Helpers
const unwrapImages = R.compose(
  R.map(R.pathOr({}, ["node", "image"])),
  R.prop("edges")
);
