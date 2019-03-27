import AxiosService from "../AxiosService";

let trackingInfoUrl = "tracking/info";
let trackingListUrl = "tracking/list";
//const trackingUrl = "document/tracking";
let getDocumentUrl = "document/info/";
let getDocumentListUrl = "document/list";
let getCuratorDocumentsUrl = "curator/document/list";
let getTodayVotedDocumentsByCuratorUrl = "curator/document/today";
let getAnalyticsListUrl = "analytics/list";
let voteDocumentUrl = "document/vote/";
let registerDocumentInfoUrl = "document/regist";
let updateDocument = "document/update";
let tagListUrl = "tags";

export default {
  GET: {
    trackingInfo: (data, callback) => {
      AxiosService._requestWithUrlPram(trackingInfoUrl, "GET", data,
        (data) => {
          callback(data);
        }, () => {
        });
    },
    trackingList: (data, callback) => {
      AxiosService._requestWithUrlPram(trackingListUrl, "GET", data,
        (data) => {
          callback(data);
        }, () => {
        });
    },
    document: (data, callback) => {
      AxiosService._requestWithUrlPram( getDocumentUrl + data, "GET", null,
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
      AxiosService._requestWithUrlPram(getAnalyticsListUrl, "GET", data,
        (data) => {
          callback(data);
        }, () => {
        });
    },
  },
  POST: {
    documentList: (data, callback, error) => {
      AxiosService._requestWithBody(getDocumentListUrl, "POST", data,
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