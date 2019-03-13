import AxiosService from "../AxiosService";

const accountSync =  "account/sync";
const accountGet =  "account/get";

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
  },
  GET: {
    accountInfo: (callback, error) => {
      AxiosService._requestPlain(accountGet, "GET",
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
  }
};