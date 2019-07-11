import { create } from 'apisauce';
import endpoints from './endpoints';

import { authenticated } from './utils';

const api = create({
  baseURL: endpoints.profileServer,
  headers: {
    'Content-Type': 'application/json'
  }
});

// if (__DEV__) {
//   api.addMonitor(response =>
//     console.log('Profile Server Response: ', response)
//   );
// }

export const getNotifications = () => authenticated(api.get, '/notifications'); // notifications tab
export const seenNotifications = () =>
  authenticated(api.get, '/seen_notifications');
export const getSavedContent = () => authenticated(api.get, '/saved_content'); // saved content tab (default)
export const getRecentActivity = userId =>
  authenticated(api.get, `/activity/${userId}`); // personal posts tab
export const getPosts = userId => authenticated(api.get, `/posts/${userId}`); // personal posts tab
export const getUserHistory = () => authenticated(api.get, '/history');
export const addReaction = (nodeId, nodeType, reactionType, reactionValue) =>
  authenticated(api.post, `/reactions/${nodeId}`, {
    nodeType,
    reactionType,
    reactionValue
  });
export const updatePreferences = updates =>
  authenticated(api.post, '/preferences', updates);

export const setOnboardingFlag = (onboardingFlags: Object): Promise<Object> =>
  authenticated(api.post, '/app/settings', { onboardingFlags });

const getFileType = uri => {
  const suffix = uri
    .split('.')
    .slice(-1)[0]
    .toLowerCase();
  if (suffix === 'png') return 'png';
  else return 'jpeg';
};

/* Function: profilePhoto
 * ---------------------
 * expects an imageUpload object
 */
export const profilePhoto = ({ uri, cropRect }) => {
  const fileType = getFileType(uri);

  let formData = new FormData();
  formData.append('photo', {
    uri: uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`
  });
  formData.append('cropRect', cropRect);

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data'
  };

  return authenticated(api.post, '/profile_photo', formData, headers);
};
