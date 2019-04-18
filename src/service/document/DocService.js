import AxiosService from "../AxiosService";

let trackingInfoUrl = "tracking/info";
let trackingListUrl = "tracking/list";
//const trackingUrl = "document/tracking";
let getDocumentUrl = "document/info";
let getDocumentListUrl = "document/list";
let getTrackingExportUrl = "tracking/export";
let getAnalyticsExportUrl = "analytics/export";
let getCuratorDocumentsUrl = "curator/document/list";
let getTodayVotedDocumentsByCuratorUrl = "curator/document/today";
let getAnalyticsListUrl = "analytics/list";
let voteDocumentUrl = "document/vote";
let documentDownloadUrl = "document/download";
let registerDocumentInfoUrl = "document/regist";
let updateDocument = "document/update";
let tagListUrl = "tags";

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
    document: (data, callback) => {
      AxiosService._requestWithUrlPram( getDocumentUrl + "/" + data, "GET", null,
        (data) => {
          callback(data);
        }, () => {
        });
    },
    tagList: (callback) => {
      AxiosService._requestPlain( tagListUrl, "GET",
        (data) => {
          callback(data);
        }, (err) => {
        });
    },
    analyticsList: (data, callback) => {
      AxiosService._requestGetWithHeader(getAnalyticsListUrl, "GET", data,
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
    analyticsExport: (data, callback) => {
      AxiosService._requestGetWithHeader(getAnalyticsExportUrl, "GET", data,
        (data) => {
          callback(data);
        }, () => {
        });
    },
    documentList: (data, callback, error) => {
      AxiosService._requestWithUrlPram(getDocumentListUrl, "GET", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
    documentDownloadUrl: (data, callback, error) => {
      AxiosService._requestWithUrlPram(documentDownloadUrl, "GET", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
    curatorDocuments: (data, callback, error) => {
      AxiosService._requestWithBody(getCuratorDocumentsUrl, "POST", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
  },
  POST: {
    todayVotedDocumentsByCurator: (data, callback, error) => {
      AxiosService._requestWithUrlPram(getTodayVotedDocumentsByCuratorUrl, "POST", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
    sendVoteInfo: (data, callback, error) => {
      AxiosService._requestWithUrlPram(voteDocumentUrl, "POST", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
    registerDocument: (data, callback, error) => {
      AxiosService._requestWithHeaderBody(registerDocumentInfoUrl, "POST", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
    updateDocument: (data, callback, error) => {
      AxiosService._requestWithHeaderBody(updateDocument, "POST", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },

  },
};