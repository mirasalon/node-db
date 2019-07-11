"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInfluencerData = exports.getBrandData = exports.sendFeedback = exports.reportData = exports.getUGC = exports.getVideos = exports.getImages = exports.getReviews = exports.getProductDetails = exports.getProductVideoRecommendation = void 0;

var _apisauce = require("apisauce");

var _config = _interopRequireDefault(require("~/config"));

var _utils = require("./utils");

var api = (0, _apisauce.create)({
  baseURL: endpoints.productServer
}); // if (__DEV__) {
//   api.addMonitor(response =>
//     console.log('ProductServer API Response: ', response)
//   );
// }

var getProductVideoRecommendation = function getProductVideoRecommendation(productId) {
  return (0, _utils.authenticated)(api.get, "/product/".concat(productId, "/recommendation/video"));
};

exports.getProductVideoRecommendation = getProductVideoRecommendation;

var getProductDetails = function getProductDetails(productId) {
  return (0, _utils.authenticated)(api.get, "/product/".concat(productId));
};

exports.getProductDetails = getProductDetails;

var getReviews = function getReviews(productId, facets, skinType, query, sortBy, rating, valence) {
  var page = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
  var paramString = (0, _utils.objToGetParams)({
    facets: facets,
    skinType: skinType,
    query: query,
    page: page,
    sortBy: sortBy,
    rating: rating,
    valence: valence,
    hitsPerPage: _config.default.search.pageLength
  });
  return (0, _utils.authenticated)(api.get, "/product/".concat(productId, "/reviews?").concat(paramString));
};

exports.getReviews = getReviews;

var getImages = function getImages(productId) {
  return (0, _utils.authenticated)(api.get, "/product/".concat(productId, "/images"));
};

exports.getImages = getImages;

var getVideos = function getVideos(productId, skinTone, skinType, tags, useEmbedding) {
  if (typeof skinTone === 'string') {
    skinTone = _config.default.appearance.skinToneNames.map(function (x) {
      return x.toLowerCase();
    }).indexOf(skinTone);
  }

  var paramString = (0, _utils.objToGetParams)({
    skinTone: skinTone !== null && skinTone !== undefined ? skinTone : undefined,
    skinType: skinType ? skinType : undefined,
    tags: tags,
    useEmbedding: useEmbedding
  });
  return (0, _utils.authenticated)(api.get, "/product/".concat(productId, "/videos?").concat(paramString));
};

exports.getVideos = getVideos;

var getUGC = function getUGC(productId) {
  return (0, _utils.authenticated)(api.get, "/product/".concat(productId, "/ugc"));
};

exports.getUGC = getUGC;

var reportData = function reportData(productId, userId, dataReport) {
  return (0, _utils.authenticated)(api.post, "/product/".concat(productId, "/report_data"), {
    userId: userId,
    dataReport: JSON.stringify(dataReport)
  });
};

exports.reportData = reportData;

var sendFeedback = function sendFeedback(productId, feedback) {
  return (0, _utils.authenticated)(api.post, "/product/".concat(productId, "/feedback"), {
    helpfulness: +feedback
  });
}; // Other Nodes


exports.sendFeedback = sendFeedback;

var getBrandData = function getBrandData(brandId) {
  return (0, _utils.authenticated)(api.get, "/brand/".concat(brandId));
};

exports.getBrandData = getBrandData;

var getInfluencerData = function getInfluencerData(influencerId) {
  return (0, _utils.authenticated)(api.get, "/influencer/".concat(influencerId));
};

exports.getInfluencerData = getInfluencerData;