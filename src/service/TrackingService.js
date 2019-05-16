import AxiosService from "./AxiosService";

let trackingInfoUrl = "tracking/info";
let trackingListUrl = "tracking/list";
let trackingConfirmUrl = "tracking/confirm";
let getTrackingExportUrl = "tracking/export";

export default {
  GET: {
    trackingInfo: (data, callback) => {
      AxiosService._requestGetWithHeader(trackingInfoUrl, "GET", data,
        (data) => {
          callback(data);
        }, () => {
        });
    },
    trackingList: (data, callback) => {
      AxiosService._requestGetWithHeader(trackingListUrl, "GET", data,
        (data) => {
          callback(data);
        }, () => {
        });
    },
    trackingExport: (data, callback) => {
      AxiosService._requestGetWithHeader(getTrackingExportUrl, "GET", data,
        (data) => {
          callback(data);
        }, () => {
        });
    },
  },
  POST: {
    trackingConfirm: (data, callback) => {
      AxiosService._requestWithBody(trackingConfirmUrl, "POST", data,
        (data) => {
          callback(data);
        }, () => {
        });
    },
  },
};