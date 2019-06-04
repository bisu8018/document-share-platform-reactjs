import AxiosService from "./AxiosService";

let accountSyncUrl =  "account/sync";
let documentsUrl =  "account/documents";
let accountGetUrl =  "account/get";
let accountUpdateUrl =  "account/update";
let ethereumSyncUrl =  "account/ethereumSync";
let profileImageUpdateUrl =  "account/picture";
let profileGetUrl = "profile/get";

export default {
  POST: {
    sync: (data, callback, error) => {
      AxiosService._requestWithHeader(accountSyncUrl, "POST", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
    accountUpdate: (data, callback, error) => {
      AxiosService._requestWithHeader(accountUpdateUrl, "POST", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
    ethereumSync: (data, callback, error) => {
      AxiosService._requestWithHeader(ethereumSyncUrl, "POST", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
    profileImageUpdate: (data, callback, error) => {
      AxiosService._requestWithHeader(profileImageUpdateUrl, "POST", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
  },
  GET: {
    documents: (data, callback, error) => {
      AxiosService._requestGetWithHeader(documentsUrl, "GET", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
    accountInfo: (data, callback, error) => {
      AxiosService._requestGetWithHeader(accountGetUrl, "GET", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
    profileGet: (data, callback, error) => {
      AxiosService._requestWithUrlPram(profileGetUrl, "GET", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
  }
};