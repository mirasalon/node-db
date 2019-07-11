import { create } from 'apisauce';
import endpoints from './endpoints';
import { authenticated, getToken } from './utils';
import { type ImageURI, type ImageBase64, type ImageFileType } from '~/images';

const api = create({
  baseURL: endpoints.faceInsightsServer,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  }
});

// if (__DEV__) {
//   api.addMonitor(response =>
//     console.log('FaceInsightsServer API Response: ', response)
//   );
// }

export const getFaceInsights = (imageBase64: ImageBase64): Promise =>
  authenticated(api.post, '/face_insights', { imageBase64, test: 'test' });