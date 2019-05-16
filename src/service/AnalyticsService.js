import AxiosService from "./AxiosService";

let getAnalyticsExportUrl = "analytics/export";
let getAnalyticsListUrl = "analytics/list";

export default {
  GET: {
    analyticsList: (data, callback) => {
      AxiosService._requestGetWithHeader(getAnalyticsListUrl, "GET", data,
        (data) => {
          callback(data);
        }, () => {
        });
    },
    analyticsExport: (data, callback) => {
      AxiosService._requestGetWithHeader(getAnalyticsExportUrl, "GET", data,
        (data) => {
          callback(data);
        }, () => {
        });
    },
  },
  POST: {},
};