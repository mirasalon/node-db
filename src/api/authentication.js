// @flow
import { create } from 'apisauce';
import endpoints from 'endpoints';
import type { BlockType } from '~/types';

const api = create({
  baseURL: endpoints.authServer
});

const fbApi = create({
  baseURL: endpoints.fbAPI
});

import {
  LoginManager,
  GraphRequest,
  GraphRequestManager,
  AccessToken
} from 'react-native-fbsdk';

// if (__DEV__) {
//   api.addMonitor(response => console.log('Authentication API Response: ', response));
// }

//==========[ SOCIAL SIGNUP ]==========

export const getFBPermission = () => {
  LoginManager.logOut();
  return LoginManager.logInWithReadPermissions(['public_profile', 'email']);
};

export const getCurrentAccessToken = () => {
  AccessToken.getCurrentAccessToken.then(data => data.accessToken.toString());
};

export const getFBProfile = (): Promise<Object> => {
  return new Promise(resolve => {
    const infoRequest = new GraphRequest(
      '/me',
      {
        parameters: {
          fields: {
            string: 'email,name'
          }
        }
      },
      (error, result) => {
        resolve({ error, result });
      }
    );

    return new GraphRequestManager().addRequest(infoRequest).start();
  });
};

export const socialLogin = (
  name: string,
  socialId: string | number,
  email: string,
  socialProvider: 'facebook' | 'google',
  appCenterDeviceId: string | number
): Promise<Object> =>
  api.post('/login/social', {
    name,
    socialId,
    email,
    socialProvider,
    appCenterDeviceId
  });

export const checkVersionUpdate = (version: string): Promise<BlockType> =>
  api.get('/version_blocker', {
    version
  });
