"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commentCreationSagas = commentCreationSagas;
exports.commentCreationSelectors = exports.commentCreationReducer = exports.default = exports.CommentCreationTypes = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _reduxsauce = require("reduxsauce");

var _seamlessImmutable = _interopRequireDefault(require("seamless-immutable"));

var _types = require("../types");

var _ids = require("../utils/ids");

var R = _interopRequireWildcard(require("ramda"));

var _reselect = require("reselect");

var _effects = require("redux-saga/effects");

var _community = require("../api/community");

var _redux = require("redux");

var _createReducer;

var _marked =
/*#__PURE__*/
_regenerator.default.mark(requestImages),
    _marked2 =
/*#__PURE__*/
_regenerator.default.mark(finishComment),
    _marked3 =
/*#__PURE__*/
_regenerator.default.mark(loadCommentData),
    _marked4 =
/*#__PURE__*/
_regenerator.default.mark(commentCreationSagas);

//=====[ Actions ]=====
var _createActions = (0, _reduxsauce.createActions)({
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
}, {
  prefix: "COMMENT_CREATION_"
}),
    Types = _createActions.Types,
    Creators = _createActions.Creators;

var CommentCreationTypes = Types;
exports.CommentCreationTypes = CommentCreationTypes;
var _default = Creators; //=====[ Reducers ]=====
// 1. Type Definitions

exports.default = _default;

// 2. Initial State
var INITIAL_STATE = _seamlessImmutable.default.from({
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
}); // 3. Reducing functions


var initComment = function initComment(state, _ref) {
  var parentId = _ref.parentId,
      parentNodeType = _ref.parentNodeType,
      commentId = _ref.commentId;
  return state.set("id", commentId || (0, _ids.generateId)()).set("parentId", parentId).set("parentNodeType", parentNodeType);
};

var setCommentData = function setCommentData(state, _ref2) {
  var data = _ref2.data;
  return state.merge(data);
};

var updateText = function updateText(state, _ref3) {
  var text = _ref3.text;
  return state.setIn(["textContent", "rawText"], text).update("selectedImages", function (images) {
    return images != null && images.length === 0 ? null : images;
  });
};

var addTag = function addTag(state, _ref4) {
  var tag = _ref4.tag;
  return state.updateIn(["textContent", "tags"], R.append(tag));
};

var addImage = function addImage(state, _ref5) {
  var imageId = _ref5.imageId;
  return state.setIn(["images", imageId], {
    productIds: []
  }).update("selectedImages", R.append(imageId));
};

var removeImage = function removeImage(state, _ref6) {
  var imageId = _ref6.imageId;
  return state.update("images", R.omit([imageId])).update("selectedImages", R.without(imageId));
};

var tagProduct = function tagProduct(state, _ref7) {
  var imageId = _ref7.imageId,
      productId = _ref7.productId;
  return state.updateIn(["images", imageId, "productIds"], R.append(productId));
};

var untagProduct = function untagProduct(state, _ref8) {
  var imageId = _ref8.imageId,
      productId = _ref8.productId;
  return state.updateIn(["images", imageId, "productIds"], R.without(productId));
};

var receiveImages = function receiveImages(state, _ref9) {
  var images = _ref9.images;
  return state.merge({
    suggestedImageData: images
  });
};

var setProductId = function setProductId(state, _ref10) {
  var productId = _ref10.productId;
  return state.set("productId", productId);
};

var RESET_MODE = {
  selectedImages: null,
  images: {},
  linkUrl: null,
  gifId: null,
  productId: null
};

var setMode = function setMode(state, _ref11) {
  var mode = _ref11.mode,
      id = _ref11.id;

  switch (mode) {
    case "link":
      return state.merge((0, _objectSpread2.default)({}, RESET_MODE, {
        linkUrl: ""
      }));

    case "gif":
      return state.merge((0, _objectSpread2.default)({}, RESET_MODE, {
        gifId: id
      }));

    case "product":
      return state.merge((0, _objectSpread2.default)({}, RESET_MODE, {
        productId: id
      }));

    case "image":
      return state.merge((0, _objectSpread2.default)({}, RESET_MODE, {
        selectedImages: []
      }));

    default:
      return state.merge(RESET_MODE);
  }
};

var resetMode = function resetMode(state) {
  return state.merge(RESET_MODE);
};

var updateLinkText = function updateLinkText(state, _ref12) {
  var update = _ref12.update;
  return state.set("linkUrl", update);
}; //TOPIC PAGE


var updateSubmitStatus = function updateSubmitStatus(state, _ref13) {
  var status = _ref13.status;
  return state.merge({
    submitStatus: status
  });
};

var resetData = function resetData() {
  return INITIAL_STATE;
}; // 4. Hook Actions and Reducers together


var commentCreationReducer = (0, _reduxsauce.createReducer)(INITIAL_STATE, (_createReducer = {}, (0, _defineProperty2.default)(_createReducer, Types.INIT_COMMENT, initComment), (0, _defineProperty2.default)(_createReducer, Types.SET_COMMENT_DATA, setCommentData), (0, _defineProperty2.default)(_createReducer, Types.SET_PRODUCT, setProductId), (0, _defineProperty2.default)(_createReducer, Types.RECEIVE_IMAGES, receiveImages), (0, _defineProperty2.default)(_createReducer, Types.UPDATE_TEXT, updateText), (0, _defineProperty2.default)(_createReducer, Types.ADD_TAG, addTag), (0, _defineProperty2.default)(_createReducer, Types.ADD_IMAGE, addImage), (0, _defineProperty2.default)(_createReducer, Types.REMOVE_IMAGE, removeImage), (0, _defineProperty2.default)(_createReducer, Types.TAG_PRODUCT, tagProduct), (0, _defineProperty2.default)(_createReducer, Types.UNTAG_PRODUCT, untagProduct), (0, _defineProperty2.default)(_createReducer, Types.RESET_MODE, resetMode), (0, _defineProperty2.default)(_createReducer, Types.SET_MODE, setMode), (0, _defineProperty2.default)(_createReducer, Types.UPDATE_LINK_TEXT, updateLinkText), (0, _defineProperty2.default)(_createReducer, Types.UPDATE_SUBMIT_STATUS, updateSubmitStatus), (0, _defineProperty2.default)(_createReducer, Types.RESET_DATA, resetData), _createReducer)); //=====[ Selectors ]=====

exports.commentCreationReducer = commentCreationReducer;
var EMPTY_LIST = [];

var commentCreationModeSelector = function commentCreationModeSelector(_ref14) {
  var _ref14$commentCreatio = _ref14.commentCreation,
      linkUrl = _ref14$commentCreatio.linkUrl,
      gifId = _ref14$commentCreatio.gifId,
      productId = _ref14$commentCreatio.productId,
      selectedImages = _ref14$commentCreatio.selectedImages;
  if (linkUrl != null) return "link";
  if (gifId != null) return "gif";
  if (productId != null) return "product";
  if (selectedImages != null) return "image";
  return "text";
};

var hasContributedContentSelector = (0, _reselect.createSelector)(commentCreationModeSelector, function (_ref15) {
  var _ref15$commentCreatio = _ref15.commentCreation,
      linkUrl = _ref15$commentCreatio.linkUrl,
      gifId = _ref15$commentCreatio.gifId,
      productId = _ref15$commentCreatio.productId,
      selectedImages = _ref15$commentCreatio.selectedImages;
  return {
    linkUrl: linkUrl,
    gifId: gifId,
    productId: productId,
    selectedImages: selectedImages
  };
}, function (mode, _ref16) {
  var linkUrl = _ref16.linkUrl,
      gifId = _ref16.gifId,
      productId = _ref16.productId,
      selectedImages = _ref16.selectedImages;

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
});
var commentCreationSelectors = {
  id: R.pathOr(null, ["commentCreation", "id"]),
  suggestedImages: R.pathOr(EMPTY_LIST, ["commentCreation", "suggestedImageData"]),
  images: R.pathOr(EMPTY_LIST, ["commentCreation", "selectedImages"]),
  tags: R.pathOr(EMPTY_LIST, ["commentCreation", "textContent", "tags"]),
  text: R.pathOr(EMPTY_LIST, ["commentCreation", "textContent", "rawText"]),
  taggedProducts: function taggedProducts(state, imageId) {
    return R.pathOr(EMPTY_LIST, ["commentCreation", "images", "" + imageId, "productIds"], state);
  },
  linkUrl: R.pathOr(EMPTY_LIST, ["commentCreation", "linkUrl"]),
  productId: R.pathOr(EMPTY_LIST, ["commentCreation", "productId"]),
  gifId: R.pathOr(EMPTY_LIST, ["commentCreation", "gifId"]),
  commentCreationMode: commentCreationModeSelector,
  hasContributedContent: hasContributedContentSelector,
  submitStatus: R.pathOr(null, ["commentCreation", "submitStatus"])
}; //=====[ Sagas ]=====

exports.commentCreationSelectors = commentCreationSelectors;

// import { parseBody } from '@redux/postCreation';
// 1. Defining Workers
function requestImages() {
  var images;
  return _regenerator.default.wrap(function requestImages$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.t0 = unwrapImages;
          _context.next = 3;
          return (0, _effects.call)(getPhotos);

        case 3:
          _context.t1 = _context.sent;
          images = (0, _context.t0)(_context.t1);
          _context.next = 7;
          return (0, _effects.put)(Creators.receiveImages(images));

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, this);
}
/* Worker: finishComment
 * ---------------------
 * Submits a comment to the backend
 */


function finishComment() {
  var _ref17, _ref17$commentCreatio, id, parentId, parentNodeType, productId, gifId, images, linkUrl, textContent, selectedImages, formattedData, _ref18, ok, data;

  return _regenerator.default.wrap(function finishComment$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _effects.put)(Creators.updateSubmitStatus("loading"));

        case 2:
          _context2.next = 4;
          return (0, _effects.select)();

        case 4:
          _ref17 = _context2.sent;
          _ref17$commentCreatio = _ref17.commentCreation;
          id = _ref17$commentCreatio.id;
          parentId = _ref17$commentCreatio.parentId;
          parentNodeType = _ref17$commentCreatio.parentNodeType;
          productId = _ref17$commentCreatio.productId;
          gifId = _ref17$commentCreatio.gifId;
          images = _ref17$commentCreatio.images;
          linkUrl = _ref17$commentCreatio.linkUrl;
          textContent = _ref17$commentCreatio.textContent;
          selectedImages = _ref17$commentCreatio.selectedImages;
          formattedData = {
            id: id,
            productIds: productId ? [productId] : [],
            textContent: textContent,
            gifs: gifId ? [gifId] : [],
            imageIds: selectedImages ? selectedImages : [],
            imageData: images,
            linkUrls: linkUrl ? [linkUrl] : [],
            parentId: parentId,
            parentNodeType: parentNodeType
          };
          _context2.next = 18;
          return (0, _effects.call)(_community.finishComment, formattedData);

        case 18:
          _ref18 = _context2.sent;
          ok = _ref18.ok;
          data = _ref18.data;

          if (ok) {
            _context2.next = 27;
            break;
          }

          _context2.next = 24;
          return (0, _effects.put)(Creators.updateSubmitStatus({
            status: "error"
          }));

        case 24:
          console.warn("error, could not finish comment", data);
          _context2.next = 33;
          break;

        case 27:
          _context2.next = 29;
          return (0, _effects.put)(Creators.updateSubmitStatus({
            status: "done"
          }));

        case 29:
          _context2.next = 31;
          return (0, _effects.put)(Creators.resetMode());

        case 31:
          _context2.next = 33;
          return (0, _effects.put)(Creators.updateText(""));

        case 33:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked2, this);
}
/* Worker: loadCommentData
 * -----------------------
 * Loads in a comment by `ugcCommentId` from NodeDB. Used in editing existing comments.
 * This does nothing if the comment doesn't exist yet.
 */


function loadCommentData(_ref19) {
  var commentId, state, comment, body, gifs, images, selectedImages, urls, productIds, parentNodeType, parentId;
  return _regenerator.default.wrap(function loadCommentData$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          commentId = _ref19.commentId;

          if (!(commentId == null)) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return");

        case 3:
          _context3.next = 5;
          return (0, _effects.select)();

        case 5:
          state = _context3.sent;
          comment = R.path(["NodeDB", "ugcComment", commentId], state);

          if (!comment) {
            _context3.next = 11;
            break;
          }

          body = comment.body, gifs = comment.gifs, images = comment.image_data, selectedImages = comment.image_ids, urls = comment.link_urls, productIds = comment.product_ids, parentNodeType = comment.parent_node_type, parentId = comment.parent_id;
          _context3.next = 11;
          return (0, _effects.put)(Creators.setCommentData({
            textContent: parseBody(body),
            selectedImages: selectedImages,
            images: images,
            parentId: parentId,
            parentNodeType: parentNodeType,
            productId: productIds && productIds.length > 0 ? productIds[0] : null,
            gifId: gifs.length > 0 ? gifs[0] : null,
            linkUrl: urls.length > 0 ? urls[0] : null
          }));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked3, this);
} // 2. Putting Sagas and Actions together


function commentCreationSagas() {
  return _regenerator.default.wrap(function commentCreationSagas$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return (0, _effects.all)([(0, _effects.takeLatest)(Types.INIT_COMMENT, loadCommentData)]);

        case 2:
          _context4.next = 4;
          return (0, _effects.all)([(0, _effects.takeLatest)(Types.REQUEST_LIBRARY_IMAGES, requestImages)]);

        case 4:
          _context4.next = 6;
          return (0, _effects.all)([(0, _effects.takeLatest)(Types.FINISH_COMMENT, finishComment)]);

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  }, _marked4, this);
} // Helpers


var unwrapImages = R.compose(R.map(R.pathOr({}, ["node", "image"])), R.prop("edges"));