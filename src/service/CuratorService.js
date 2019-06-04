import AxiosService from "./AxiosService";

let getCuratorDocumentsUrl = "curator/document/list";
let getCuratorSummaryUrl = "curator/summary";

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
      AxiosService._requestWithUrlPram(getCuratorSummaryUrl, "GET", data,
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