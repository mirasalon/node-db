import {create} from 'apisauce';
import config from '~/config';
import {authenticated, uploadImage} from './utils';

const api = create({
  baseURL: endpoints.profileServer
});

// if (__DEV__) {
//   api.addMonitor(response => console.log('Got API Response: ', response));
// }

export const updatePreferences = ({
  brandPreferences: brands,
  subcategoryPreferences: subcategories,
  skinTone,
  undertone,
  eyeColor,
  skinType
}) =>
  authenticated(api.post, '/preferences', {
    brands,
    subcategories,
    skinTone,
    undertone,
    eyeColor,
    skinType
  });

export const uploadProfilePhoto = ({ uri, path }) =>
  uploadImage({
    api,
    endpoint: '/profile_photo',
    uri,
    path,
    extraData: {}
  });
