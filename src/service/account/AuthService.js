import AxiosService from "../AxiosService";
import { AUTH_CONFIG } from 'properties/auth.properties';

const accountSync =  "account/sync";

export default {
  POST: {
    sync: (data, callback, error) => {
      AxiosService._requestWithUrlPram(accountSync, "POST", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
  }
};