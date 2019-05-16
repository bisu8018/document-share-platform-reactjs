import AxiosService from "./AxiosService";

let getDocumentUrl = "document/info";
let getDocumentListUrl = "document/list";
let voteDocumentUrl = "document/vote";
let documentDownloadUrl = "document/download";
let registerDocumentInfoUrl = "document/regist";
let updateDocument = "document/update";
let tagListUrl = "tags";

export default {
  GET: {
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
  },
  POST: {
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