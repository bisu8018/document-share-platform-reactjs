import AxiosService from "../AxiosService";

const accountSync =  "account/sync";

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
  }
};