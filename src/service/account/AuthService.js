import AxiosService from "../AxiosService";

let accountSync =  "account/sync";
let accountGet =  "account/get";
let accountUpdate =  "account/update";
let ethereumSync =  "account/ethereumSync";
let profileImageUpdate =  "account/picture";
let profileGet = "profile/get";

export default {
  POST: {
    sync: (data, callback, error) => {
      AxiosService._requestWithHeader(accountSync, "POST", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
    accountUpdate: (data, callback, error) => {
      AxiosService._requestWithHeader(accountUpdate, "POST", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
    ethereumSync: (data, callback, error) => {
      AxiosService._requestWithHeader(ethereumSync, "POST", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
    profileImageUpdate: (data, callback, error) => {
      AxiosService._requestWithHeader(profileImageUpdate, "POST", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
  },
  GET: {
    accountInfo: (data, callback, error) => {
      AxiosService._requestGetWithHeader(accountGet, "GET", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
    profileGet: (data, callback, error) => {
      AxiosService._requestWithUrlPram(profileGet, "GET", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
  }
};