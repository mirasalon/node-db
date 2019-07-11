import R from 'ramda';
import _ from 'lodash';
import { create } from 'apisauce';
import algolia from 'algoliasearch/reactnative';
import endpoints from './endpoints';
import { authenticated, prepareGetParams } from './utils';

//################################################################################
// SETUP
//################################################################################

const api = create({
  baseURL: endpoints.searchServer,
  headers: {
    'Content-Type': 'application/json'
  }
});

// if (__DEV__) {
//   api.addMonitor(response =>
//     console.log('SearchServer API Response: ', response)
//   );
// }

var client = algolia(
  config.algolia.credentials.id,
  config.algolia.credentials.key
);

var index = client.initIndex(config.algolia.indexes.searchPage);
//################################################################################
// SEARCH API
//################################################################################
export const search = (query, predicates, remainingQuery = '', page = 0) =>
  authenticated(api.post, '/search', {
    rawQuery: query,
    predicates: JSON.stringify(predicates),
    remainingUnstructuredQuery: remainingQuery,
    page: `${page}`
  });

//################################################################################
// LEGACY APIs
//################################################################################

export const getProductRecs = () => authenticated(api.get, '/home');

/* Function: textualSearch
 * ------------------------
 * Called when we have a text query.
 */
export const textualSearch = (
  query,
  filter,
  offset = 0,
  subcategory = null
) => {
  if (isUserSearch(filter)) {
    return searchUsers({ query });
  }

  if (filter === 'products') {
    return algoliaProductSearch({
      query: query || '',
      nodeType: 'product',
      offset,
      hitsPerPage: config.search.pageLength,
      filters: subcategory ? { subcategory } : {}
    }).then(({ ok, data, err }) => {
      if (!ok) return Promise.reject(err);
      return data;
    });
  }

  return new Promise((resolve, reject) => {
    const filterString = getFilters(filter);

    index.search(
      {
        query,
        filters: filterString,
        offset,
        length: config.search.pageLength
      },
      (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      }
    );
  });
};

//################################################################################
// DEPRECATED APIs
//################################################################################

export const getRecent = () => authenticated(api.get, '/recent');
export const getArticleSuggestions = () =>
  authenticated(api.get, '/suggestions-articles');
export const getBrandSuggestions = () =>
  authenticated(api.get, '/suggestions-brands');
export const getFeaturedBrand = () =>
  authenticated(api.get, '/suggestions-brand-products');
export const logUserSearch = payload =>
  authenticated(api.post, '/algolia-log', payload);

const searchUsers = ({ query: userName, numResults = 20 }) =>
  authenticated(api.get, '/users', { userName, numResults });

const getTagFilters = filters => {
  return _.concat(
    [filters.subcategory],
    [filters.categories],
    filters.facets,
    filters.properties,
    filters.tags,
    filters.formFactors
  ).filter(x => x);
};

const getNumericFilters = ({ minPrice, maxPrice }) => {
  let numericFilters = [];
  if (minPrice) numericFilters = [`price>=${minPrice}`];
  if (maxPrice) numericFilters = [...numericFilters, `price<=${maxPrice}`];
  return numericFilters.length > 0 ? numericFilters : undefined;
};

const getFacetFilters = (filters, nodeType) => {
  let facetFilters = [`__typename:${nodeType}`];
  if (!nodeType) {
    facetFilters = ['__typename:product'];
  }
  if (filters.brandId) {
    facetFilters = [...facetFilters, `brandId:${filters.brandId}`];
  }
  // if (filters.formFactor) {
  //   facetFilters = [...facetFilters, `formFactor:${filters.formFactor}`];
  // }
  return facetFilters;
};

export const algoliaProductSearch = ({
  query,
  nodeType,
  filters,
  offset,
  hitsPerPage
}) => {
  return new Promise((resolve, reject) => {
    index.search(
      {
        query,
        facetFilters: getFacetFilters(filters, nodeType),
        tagFilters: getTagFilters(filters),
        numericFilters: getNumericFilters(filters),
        length: config.search.pageLength,
        offset: offset
      },
      (err, data) => {
        if (err) resolve({ ok: false, data, err });
        else resolve({ ok: true, data });
      }
    );
  });
};

export const awsProductSearch = ({ query, filters, offset, hitsPerPage }) =>
  authenticated(api.get, 'products', {
    ...prepareGetParams(filters),
    hitsPerPage,
    page: Math.floor(offset / hitsPerPage)
  });

/* Function: searchProducts
 * ------------------------
 * Acts as a general-purpose product fetcher, doing the "switching" between
 * algolia and AWS for us. Return values will be the same.
 */
export const searchProducts = (
  filters,
  offset = 0,
  hitsPerPage = config.search.pageLength
) => {
  if (
    R.pathOr([], ['facets'], filters).length >= 1 ||
    R.pathOr([], ['skinTypes'], filters).length >= 1 ||
    R.path(['subcategory'], filters) === 'top'
  ) {
    return awsProductSearch({ query: '', filters, offset, hitsPerPage });
  } else {
    let aPromise = algoliaProductSearch({
      query: filters.query || '',
      nodeType: filters.nodeType,
      filters,
      offset,
      hitsPerPage
    });
    return aPromise;
  }
};

const getFilters = R.compose(
  R.cond([
    [
      filters => filters.length === 1,
      ([filter]) => config.algolia.filters[filter]
    ],
    [
      R.T,
      ([first, tag]) => config.algolia.filters[first] + ' AND ' + `_tags:${tag}`
    ]
  ]),
  R.split(':')
);

const isUserSearch = R.compose(
  ([filter]) => {
    return filter === 'users';
  },
  R.split(':')
);
