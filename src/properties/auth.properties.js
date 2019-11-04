import { APP_PROPERTIES } from './app.properties';

export const AUTH_CONFIG = {
  domain: 'decompany.auth0.com',
  clientID: 'e7kW3VpEKzprBPyHy13VL221pB1q971j',
  redirectUri: APP_PROPERTIES.domain().mainHost + '/callback',
  responseType: "token id_token",
  scope: "openid profile email"
};
