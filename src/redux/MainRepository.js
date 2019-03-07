import DocService from "../service/document/DocService";
import AuthService from "../service/account/AuthService";
import DocumentList from "./model/DocumentList";
import Document from "./model/Document";
import DocumentText from "./model/DocumentText";
import CuratorDocuments from "./model/CuratorDocuments";

export default {
  init: () => {

  },
  initData: () => {

  },
  Account: {
    sync: (token, userInfo, callback, error) => {
      const data = {
        header: {
          "Authorization": `Bearer ${token}`
        },
        params: userInfo
      };
      AuthService.POST.sync(data, (result) => {
        callback(result);
      }, (err) => {
        error(err);
      });
    }
  },
  Document: {
    getTrackingInfo: (cid, documentId, callback) => {
      const data = {cid: cid , documentId: documentId};
      //console.log("getTrackingInfo", data);
      DocService.GET.trackingInfo(data, (result) => {
        callback(result);
      });
    },
    getTrackingList: (documentId, callback) => {
      const data = { documentId: documentId};
      //console.log("getTrackingList", data);
      DocService.GET.trackingList(data, (result) => {
        callback(result);
      });
    },
    getDocument: (documentId, callback) => {
      DocService.GET.document(documentId, (result) => {
        let document = new Document(result);
        callback(document);
      });
    },
    getDocumentText: (documentId, callback) => {
      DocService.GET.documentText(documentId, (result) => {
        let documentText = new DocumentText(result);
        callback(documentText);
      });
    },
    getDocumentList: (params, callback, error) => {
      DocService.POST.documentList(params, (result) => {
        let documents = new DocumentList(result);
        callback(documents);
      }, (err) => {
        error(err);
      });
    },
    getCuratorDocuments: (params, callback, error) => {
      let key = null;
      if (params.nextPageKey) {
        key = btoa(JSON.stringify(params.nextPageKey));
        console.log(params, " base64 encoded to ", key);
      } else {
        console.log("first page");
      }

      DocService.POST.curatorDocuments(params, (result) => {
        let curatorDocuments = new CuratorDocuments(result);
        callback(curatorDocuments);
      }, (err) => {
        error(err);
      });
    },
    getTodayVotedDocumentsByCurator: (params, callback, error) => {
      const data = {
        accountId: params.accountId
      };
      DocService.POST.todayVotedDocumentsByCurator(data, (result) => {
        callback(result);
      });
    },
    sendVoteInfo: (ethAccount, curatorId, voteAmount, document, transactionResult, callback, error) => {
      console.log("sendVoteInfo", curatorId, voteAmount);
      if (!curatorId || !document || isNaN(voteAmount) || voteAmount <= 0 || !ethAccount) {
        console.error("sendVoteInfo Parameter Invaild", error);
        return;
      }

      const params = {
        curatorId: curatorId,
        voteAmount: voteAmount,
        documentId: document.documentId,
        ethAccount: ethAccount,
        transaction: transactionResult
      };

      DocService.POST.todayVotedDocumentsByCurator(params, (result) => {
        callback(result);
      });
    }
  }
};