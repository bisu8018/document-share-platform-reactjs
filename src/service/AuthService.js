import AxiosService from "./AxiosService";

let accountSyncUrl = "account/sync";
let documentsUrl = "account/documents";
let accountGetUrl = "account/get";
let accountUpdateUrl = "account/update";
let ethereumSyncUrl = "account/ethereumSync";
let profileImageUpdateUrl = "account/picture";
let profileGetUrl = "profile/get";

export default {
  POST: {
    sync: (data, callback, error) => {
      AxiosService._requestWithHeader(accountSyncUrl, "POST", data,
        data => callback(data)
        , err => error(err));
    },
    accountUpdate: data => {
      return new Promise((resolve, reject) => {
        AxiosService._requestWithHeaderBody(accountUpdateUrl, "POST", data,
          data => resolve(data)
          , err => reject(err));
      });
    },
    ethereumSync: (data) => {
      return new Promise((resolve, reject) => {
      AxiosService._requestWithHeader(ethereumSyncUrl, "POST", data,
        data => resolve(data)
        , err => reject(err));
      });
    },
    profileImageUpdate: (data) => {
      return new Promise((resolve, reject) => {
        AxiosService._requestWithHeader(profileImageUpdateUrl, "POST", data,
          data => resolve(data)
          , err => reject(err));
      });
    }
  },
  GET: {
    documents: (data) => {
      return new Promise((resolve, reject) => {
        AxiosService._requestGetWithHeader(documentsUrl, "GET", data,
          data => resolve(data)
          , err => reject(err));
      });
    },
    accountInfo: (data) => {
      return new Promise((resolve, reject) => {
        AxiosService._requestGetWithHeader(accountGetUrl, "GET", data,
          data => resolve(data)
          , err => reject(err));
      });
    },
    profileGet: (data) => {
      return new Promise((resolve, reject) => {
        AxiosService._requestWithUrlPram(profileGetUrl, "GET", data,
          data => resolve(data)
          , err => reject(err));
      });
    },
  }
};
