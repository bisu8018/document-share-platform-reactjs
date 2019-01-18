import axios from 'axios';
import * as ajax from './CommonAjaxApis';
import { APP_PROPERTIES } from '../resources/app.properties';
import { AUTH_CONFIG } from '../resources/auth.properties';

const apiDomain = APP_PROPERTIES.domain().api;

export function getUserInfo(idToken) {
  return ajax.post(null, null);
}


export async function sync(token){
  //console.log("sync", token);
  const url = apiDomain + "/api/account/sync";
  const config = {
    header: {
       'Access-Control-Allow-Origin': '*',
       'Content-Type':'application/json',
       'Authorization': `Bearer ${token}`
    }
  }

  return ajax.post(url, config);
}