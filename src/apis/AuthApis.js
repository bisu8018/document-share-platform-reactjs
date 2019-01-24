import axios from 'axios';
import * as ajax from './CommonAjaxApis';
import { APP_PROPERTIES } from '../resources/app.properties';
import { AUTH_CONFIG } from '../resources/auth.properties';

const apiDomain = APP_PROPERTIES.domain().api;

export function getUserInfo(idToken) {
  return ajax.post(null, null);
}


export function sync(token){
  //console.log("sync", token);
  const url = apiDomain + "/api/account/sync";
  const data = {
    header: {
       'Authorization': `Bearer ${token}`
    }
  }

  return ajax.post(url, data);
}