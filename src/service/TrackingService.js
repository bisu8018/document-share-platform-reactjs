import AxiosService from "./AxiosService";

let trackingInfoUrl = "tracking/info";
let trackingListUrl = "tracking/list";
let trackingConfirmUrl = "tracking/confirm";
let getTrackingExportUrl = "tracking/export";

export default {
  GET: {
    trackingInfo: (data, callback, error) => {
      AxiosService._requestGetWithHeader(trackingInfoUrl, "GET", data,
        data => callback(data)
        , err => error(err));
    },
    trackingList: (data, callback, error) => {
      AxiosService._requestGetWithHeader(trackingListUrl, "GET", data,
        data => callback(data)
        , err => error(err));
    },
    trackingExport: (data, callback) => {
      AxiosService._requestGetWithHeader(getTrackingExportUrl, "GET", data,
        data => callback(data)
        , err => err);
    }
  },
  POST: {
    trackingConfirm: (data, callback) => {
      AxiosService._requestWithBody(trackingConfirmUrl, "POST", data,
        data => callback(data)
        , err => err);
    }
  }
};
