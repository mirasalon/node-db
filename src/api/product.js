import { create } from 'apisauce';
import config from '~/config';
import { authenticated, objToGetParams } from './utils';

const api = create({
  baseURL: endpoints.productServer
});

// if (__DEV__) {
//   api.addMonitor(response =>
//     console.log('ProductServer API Response: ', response)
//   );
// }

export const getProductVideoRecommendation = productId =>
  authenticated(api.get, `/product/${productId}/recommendation/video`);

export const getProductDetails = productId =>
  authenticated(api.get, `/product/${productId}`);

export const getReviews = (
  productId,
  facets,
  skinType,
  query,
  sortBy,
  rating,
  valence,
  page = 0
) => {
  const paramString = objToGetParams({
    facets,
    skinType,
    query,
    page,
    sortBy,
    rating,
    valence,
    hitsPerPage: config.search.pageLength
  });
  return authenticated(api.get, `/product/${productId}/reviews?${paramString}`);
};

export const getImages = productId =>
  authenticated(api.get, `/product/${productId}/images`);

export const getVideos = (
  productId,
  skinTone,
  skinType,
  tags,
  useEmbedding
) => {
  if (typeof skinTone === 'string') {
    skinTone = config.appearance.skinToneNames
      .map(x => x.toLowerCase())
      .indexOf(skinTone);
  }
  const paramString = objToGetParams({
    skinTone:
      skinTone !== null && skinTone !== undefined ? skinTone : undefined,
    skinType: skinType ? skinType : undefined,
    tags,
    useEmbedding
  });
  return authenticated(api.get, `/product/${productId}/videos?${paramString}`);
};

export const getUGC = productId =>
  authenticated(api.get, `/product/${productId}/ugc`);

export const reportData = (productId, userId, dataReport) =>
  authenticated(api.post, `/product/${productId}/report_data`, {
    userId: userId,
    dataReport: JSON.stringify(dataReport)
  });

export const sendFeedback = (productId, feedback) =>
  authenticated(api.post, `/product/${productId}/feedback`, {
    helpfulness: +feedback
  });

// Other Nodes
export const getBrandData = brandId =>
  authenticated(api.get, `/brand/${brandId}`);

export const getInfluencerData = influencerId =>
  authenticated(api.get, `/influencer/${influencerId}`);
