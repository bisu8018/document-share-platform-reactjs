import AxiosService from "../AxiosService";

const trackingInfoUrl = "tracking/info";
const trackingListUrl = "tracking/list";
const trackingUrl = "document/tracking";
const getDocumentUrl = "document/info/";
const documentTextUrl = "document/text/";
const getDocumentListUrl = "document/list";
const getCuratorDocumentsUrl = "curator/document/list";
const getTodayVotedDocumentsByCuratorUrl = "curator/document/today";
const voteDocumentUrl = "document/vote/";
const registDocumentInfoUrl = "document/regist";

export default {
  GET: {
    trackingInfo: (data, callback) => {
      AxiosService._requestWithUrlPram(trackingInfoUrl, "GET", data,
        (data) => {
        console.log(data);
          callback(data);
        }, () => {
        });
    },
    trackingList: (data, callback) => {
      AxiosService._requestWithUrlPram(trackingListUrl, "GET", data,
        (data) => {
          console.log(data);
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
    documentText: (data, callback) => {
      AxiosService._requestWithUrlPram( documentTextUrl + data, "GET", {},
        (data) => {console.log(123);
          callback(data);
        }, (err) => {console.log(err);
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
    promise: (data, callback, error) => {
      AxiosService._requestWithUrlPram(registDocumentInfoUrl, "POST", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err);
        });
    },
  },
};