import AxiosService from "./AxiosService";

let getCuratorDocumentsUrl = "curator/document/list";
let getCuratorSummary = "curator/summary";

export default {
  GET: {
    curatorDocuments: (data, callback, error) => {
      AxiosService._requestWithUrlPram(getCuratorDocumentsUrl, "GET", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
    curatorSummary: (data, callback, error) => {
      AxiosService._requestWithUrlPram(getCuratorSummary, "GET", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
  },
  POST: {

  },
};