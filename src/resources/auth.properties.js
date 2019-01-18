import { APP_PROPERTIES } from './app.properties';

export const AUTH_CONFIG = {
  domain: 'decompany.auth0.com',
  clientId: 'e7kW3VpEKzprBPyHy13VL221pB1q971j',
  callbackUrl: APP_PROPERTIES.domain().mainHost + '/callback'
  //callbackUrl: 'http://localhost:8000/callback'
  //callbackUrl: 'http://share.decompany.io/callback'
}
