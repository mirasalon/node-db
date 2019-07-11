"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchProducts = exports.awsProductSearch = exports.algoliaProductSearch = exports.logUserSearch = exports.getFeaturedBrand = exports.getBrandSuggestions = exports.getArticleSuggestions = exports.getRecent = exports.textualSearch = exports.getProductRecs = exports.search = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _ramda = _interopRequireDefault(require("ramda"));

var _lodash = _interopRequireDefault(require("lodash"));

var _apisauce = require("apisauce");

var _reactnative = _interopRequireDefault(require("algoliasearch/reactnative"));

var _endpoints = _interopRequireDefault(require("./endpoints"));

var _utils = require("./utils");

//################################################################################
// SETUP
//################################################################################
var api = (0, _apisauce.create)({
  baseURL: _endpoints.default.searchServer,
  headers: {
    'Content-Type': 'application/json'
  }
}); // if (__DEV__) {
//   api.addMonitor(response =>
//     console.log('SearchServer API Response: ', response)
//   );
// }

var client = (0, _reactnative.default)(config.algolia.credentials.id, config.algolia.credentials.key);
var index = client.initIndex(config.algolia.indexes.searchPage); //################################################################################
// SEARCH API
//################################################################################

var search = function search(query, predicates) {
  var remainingQuery = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var page = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  return (0, _utils.authenticated)(api.post, '/search', {
    rawQuery: query,
    predicates: JSON.stringify(predicates),
    remainingUnstructuredQuery: remainingQuery,
    page: "".concat(page)
  });
}; //################################################################################
// LEGACY APIs
//################################################################################


exports.search = search;

var getProductRecs = function getProductRecs() {
  return (0, _utils.authenticated)(api.get, '/home');
};
/* Function: textualSearch
 * ------------------------
 * Called when we have a text query.
 */


exports.getProductRecs = getProductRecs;

var textualSearch = function textualSearch(query, filter) {
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var subcategory = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  if (isUserSearch(filter)) {
    return searchUsers({
      query: query
    });
  }

  if (filter === 'products') {
    return algoliaProductSearch({
      query: query || '',
      nodeType: 'product',
      offset: offset,
      hitsPerPage: config.search.pageLength,
      filters: subcategory ? {
        subcategory: subcategory
      } : {}
    }).then(function (_ref) {
      var ok = _ref.ok,
          data = _ref.data,
          err = _ref.err;
      if (!ok) return Promise.reject(err);
      return data;
    });
  }

  return new Promise(function (resolve, reject) {
    var filterString = getFilters(filter);
    index.search({
      query: query,
      filters: filterString,
      offset: offset,
      length: config.search.pageLength
    }, function (err, data) {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
}; //################################################################################
// DEPRECATED APIs
//################################################################################


exports.textualSearch = textualSearch;

var getRecent = function getRecent() {
  return (0, _utils.authenticated)(api.get, '/recent');
};

exports.getRecent = getRecent;

var getArticleSuggestions = function getArticleSuggestions() {
  return (0, _utils.authenticated)(api.get, '/suggestions-articles');
};

exports.getArticleSuggestions = getArticleSuggestions;

var getBrandSuggestions = function getBrandSuggestions() {
  return (0, _utils.authenticated)(api.get, '/suggestions-brands');
};

exports.getBrandSuggestions = getBrandSuggestions;

var getFeaturedBrand = function getFeaturedBrand() {
  return (0, _utils.authenticated)(api.get, '/suggestions-brand-products');
};

exports.getFeaturedBrand = getFeaturedBrand;

var logUserSearch = function logUserSearch(payload) {
  return (0, _utils.authenticated)(api.post, '/algolia-log', payload);
};

exports.logUserSearch = logUserSearch;

var searchUsers = function searchUsers(_ref2) {
  var userName = _ref2.query,
      _ref2$numResults = _ref2.numResults,
      numResults = _ref2$numResults === void 0 ? 20 : _ref2$numResults;
  return (0, _utils.authenticated)(api.get, '/users', {
    userName: userName,
    numResults: numResults
  });
};

var getTagFilters = function getTagFilters(filters) {
  return _lodash.default.concat([filters.subcategory], [filters.categories], filters.facets, filters.properties, filters.tags, filters.formFactors).filter(function (x) {
    return x;
  });
};

var getNumericFilters = function getNumericFilters(_ref3) {
  var minPrice = _ref3.minPrice,
      maxPrice = _ref3.maxPrice;
  var numericFilters = [];
  if (minPrice) numericFilters = ["price>=".concat(minPrice)];
  if (maxPrice) numericFilters = [].concat((0, _toConsumableArray2.default)(numericFilters), ["price<=".concat(maxPrice)]);
  return numericFilters.length > 0 ? numericFilters : undefined;
};

var getFacetFilters = function getFacetFilters(filters, nodeType) {
  var facetFilters = ["__typename:".concat(nodeType)];

  if (!nodeType) {
    facetFilters = ['__typename:product'];
  }

  if (filters.brandId) {
    facetFilters = [].concat((0, _toConsumableArray2.default)(facetFilters), ["brandId:".concat(filters.brandId)]);
  } // if (filters.formFactor) {
  //   facetFilters = [...facetFilters, `formFactor:${filters.formFactor}`];
  // }


  return facetFilters;
};

var algoliaProductSearch = function algoliaProductSearch(_ref4) {
  var query = _ref4.query,
      nodeType = _ref4.nodeType,
      filters = _ref4.filters,
      offset = _ref4.offset,
      hitsPerPage = _ref4.hitsPerPage;
  return new Promise(function (resolve, reject) {
    index.search({
      query: query,
      facetFilters: getFacetFilters(filters, nodeType),
      tagFilters: getTagFilters(filters),
      numericFilters: getNumericFilters(filters),
      length: config.search.pageLength,
      offset: offset
    }, function (err, data) {
      if (err) resolve({
        ok: false,
        data: data,
        err: err
      });else resolve({
        ok: true,
        data: data
      });
    });
  });
};

exports.algoliaProductSearch = algoliaProductSearch;

var awsProductSearch = function awsProductSearch(_ref5) {
  var query = _ref5.query,
      filters = _ref5.filters,
      offset = _ref5.offset,
      hitsPerPage = _ref5.hitsPerPage;
  return (0, _utils.authenticated)(api.get, 'products', (0, _objectSpread2.default)({}, (0, _utils.prepareGetParams)(filters), {
    hitsPerPage: hitsPerPage,
    page: Math.floor(offset / hitsPerPage)
  }));
};
/* Function: searchProducts
 * ------------------------
 * Acts as a general-purpose product fetcher, doing the "switching" between
 * algolia and AWS for us. Return values will be the same.
 */


exports.awsProductSearch = awsProductSearch;

var searchProducts = function searchProducts(filters) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var hitsPerPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : config.search.pageLength;

  if (_ramda.default.pathOr([], ['facets'], filters).length >= 1 || _ramda.default.pathOr([], ['skinTypes'], filters).length >= 1 || _ramda.default.path(['subcategory'], filters) === 'top') {
    return awsProductSearch({
      query: '',
      filters: filters,
      offset: offset,
      hitsPerPage: hitsPerPage
    });
  } else {
    var aPromise = algoliaProductSearch({
      query: filters.query || '',
      nodeType: filters.nodeType,
      filters: filters,
      offset: offset,
      hitsPerPage: hitsPerPage
    });
    return aPromise;
  }
};

exports.searchProducts = searchProducts;

var getFilters = _ramda.default.compose(_ramda.default.cond([[function (filters) {
  return filters.length === 1;
}, function (_ref6) {
  var _ref7 = (0, _slicedToArray2.default)(_ref6, 1),
      filter = _ref7[0];

  return config.algolia.filters[filter];
}], [_ramda.default.T, function (_ref8) {
  var _ref9 = (0, _slicedToArray2.default)(_ref8, 2),
      first = _ref9[0],
      tag = _ref9[1];

  return config.algolia.filters[first] + ' AND ' + "_tags:".concat(tag);
}]]), _ramda.default.split(':'));

var isUserSearch = _ramda.default.compose(function (_ref10) {
  var _ref11 = (0, _slicedToArray2.default)(_ref10, 1),
      filter = _ref11[0];

  return filter === 'users';
}, _ramda.default.split(':'));