import ReactGA from "react-ga";
import auth0 from "auth0-js";
import axios from "axios";
import history from "apis/history/history";
import { AUTH_CONFIG } from "properties/auth.properties";
import { APP_PROPERTIES } from "properties/app.properties";
import DocService from "../service/document/DocService";
import AuthService from "../service/account/AuthService";
import DocumentList from "./model/DocumentList";
import Document from "./model/Document";
import CuratorDocuments from "./model/CuratorDocuments";
import TagList from "./model/TagList";
import AnalyticsList from "./model/AnalyticsList";

let instance: any;

export default {
  init() {
    // 자기 참조
    instance = this;

    if (this.Account.isAuthenticated()) {
      this.Account.scheduleRenewal();
    } else {
      this.Account.clearSession();
    }

    this.InitData.hsq = window._hsq = window._hsq || [];

    this.InitData.authData = new auth0.WebAuth({
      domain: AUTH_CONFIG.domain,
      clientID: AUTH_CONFIG.clientId,
      redirectUri: AUTH_CONFIG.callbackUrl,
      responseType: "token id_token",
      scope: "openid profile email"
    });
  },
  InitData: {
    authData: {},
    hsq: []
  },
  Analytics: {
    sendPageView() {
      instance.InitData.hsq.push(["setPath", window.location.pathname + window.location.search]);
      instance.InitData.hsq.push(["trackPageView"]);

      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  },
  Account: {
    login(isSilentAuthentication) {
      if (isSilentAuthentication) {
        instance.InitData.authData.authorize({ prompt: "none" });
      } else {
        instance.InitData.authData.authorize();
      }
    },
    logout() {
      this.clearSession();
      instance.InitData.authData.logout({
        returnTo: APP_PROPERTIES.domain().mainHost,
        clientID: AUTH_CONFIG.clientId
      });
    },
    sync(callback, error) {
      const token = sessionStorage.getItem("id_token");
      const userInfo = sessionStorage.getItem("user_info");
      const data = {
        header: {
          "Authorization": `Bearer ${token}`
        },
        data: userInfo
      };
      AuthService.POST.sync(data, (result) => {
        callback(result);
      }, (err) => {
        error(err);
      });
    },
    syncUser() {
      const session = this.getSession();
      const idToken = sessionStorage.getItem("id_token");
      if (idToken && session) {
        this.sync(res => {
          if (res.success) {
            sessionStorage.setItem("user_sync", JSON.stringify(res));
          } else {
            alert("Login failed because user sync failed.");
            this.logout();
          }
        }, (err) => {
          console.log(err);
        });
      } else {
        console.log("session is not init...");
      }
    },
    isAuthenticated() {
      const expiresAt = JSON.parse(sessionStorage.getItem("expires_at"));
      const isUnExpired = new Date().getTime() < expiresAt;

      if (!isUnExpired) {
        //console.error("Session Expired", expiresAt, sessionStorage);
        this.clearSession();
      }

      return isUnExpired;
    },
    scheduleRenewal() {
      let expiresAt = JSON.parse(sessionStorage.getItem("expires_at"));
      let timeout = expiresAt - Date.now(); //mms
      if (timeout > 0) {
        (() => {
          setTimeout(() => {
            this.renewSession();
          }, timeout);
        })();
      } else if (timeout <= 0) {
        this.logout();
      }
    },
    renewSession() {
      instance.InitData.authData.checkSession({}, (err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setUserInfo(authResult, user => {
            this.setSession(authResult, user);
          });
        } else if (err) {
          this.logout();
          console.log(err);
        }
      });
    },
    renewSessionPromise() {
      return new Promise((resolve, reject) => {
        instance.InitData.authData.checkSession({}, (err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            resolve(authResult);
            this.setUserInfo(authResult, user => {
              this.setSession(authResult, user);
            });
          } else if (err) {
            console.log(err);
            reject(err);
          }
        });
      });
    },
    handleAuthentication({ location }) {
      if (/access_token|id_token|error/.test(location.hash)) {
        instance.InitData.authData.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            console.log("handleAuthentication", authResult, err);
            this.setUserInfo(authResult, user => {
              this.setSession(authResult, user);
              this.scheduleRenewal();
              this.syncUser();
              history.push("/");
            });

          } else if (err) {
            this.clearSession();
            //console.error(err);
          }
        });
      }
    },
    handleLogout: () => {
      alert("handleLogout()");
      this.clearSession();
      // navigate to the home route
      history.replace("/");
    },
    setUserInfo(authResult, callback) {
      instance.InitData.authData.client.userInfo(authResult.accessToken, (err, user) => {
        if (err) {
          //console.error("Getting userInfo", err);
          alert(`Error: ${err.error}. Getting UserInfo`);
        } else {
          //console.log("Getting Userinfo Success!!", { user, authResult });
          callback(user);
        }
      });
    },
    setSession(authResult, userInfo) {
      console.log("access_token", authResult.accessToken);
      let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      sessionStorage.setItem("access_token", authResult.accessToken);
      sessionStorage.setItem("id_token", authResult.idToken);
      sessionStorage.setItem("expires_at", expiresAt);
      if (userInfo) {
        sessionStorage.setItem("user_info", JSON.stringify(userInfo));
      }
    },
    getAccountInfo(id, callback, error) {
      const token = sessionStorage.getItem("id_token");
      const data = {
        header: {
          "Authorization": `Bearer ${token}`
        },
        params: {
          "id": id
        }
      };

      AuthService.GET.accountInfo(data, (result) => {
        callback(result);
      }, err => {
        error(err);
      });
    },
    getUserInfo() {
      const userInfo = JSON.parse(sessionStorage.getItem("user_info"));
      if (!userInfo && this.isAuthenticated()) {
        this.renewSession();
        return {};
      }
      return userInfo;
    },
    getExpireDate() {
      const expiresAt = JSON.parse(sessionStorage.getItem("expires_at"));
      if (!expiresAt && this.isAuthenticated()) {
        this.renewSession();
        return {};
      }
      return JSON.stringify(new Date(expiresAt));
    },
    getEmail() {
      const userInfo = JSON.parse(sessionStorage.getItem("user_info"));

      if(!userInfo && !this.isAuthenticated()){
        return false;
      }

      if (!userInfo && this.isAuthenticated()) {
        this.renewSession();
        return "";
      }
      return userInfo.email;
    },
    getSession() {
      return (
        {
          accessToken: sessionStorage.getItem("access_token"),
          idToken: sessionStorage.getItem("id_token"),
          userInfo: JSON.parse(sessionStorage.getItem("user_info")),
          expiresAt: JSON.parse(sessionStorage.getItem("expires_at"))
        });
    },
    clearSession() {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("id_token");
      sessionStorage.removeItem("expires_at");
      sessionStorage.removeItem("user_info");
    }
  },
  Document: {
    async registerDocument(args, progress, callback) {
      const authResult = await instance.Account.renewSessionPromise();
      let fileInfo = args.fileInfo;
      let user = args.userInfo;
      let ethAccount = args.ethAccount;
      let tags = args.tags;
      let title = args.title;
      let desc = args.desc;
      let useTracking = args.useTracking;
      let token = authResult.idToken;

      const data = {
        data: {
          filename: fileInfo.file.name,
          size: fileInfo.file.size,
          username: user.name,
          sub: user.sub,
          ethAccount: ethAccount,
          title: title,
          desc: desc,
          tags: tags,
          useTracking: useTracking
        },
        header: {
          "Authorization": `Bearer ${token}`
        }
      };
      if (!fileInfo.file) {
        console.error("The registration value(file or metadata) is invalid.", fileInfo);
        return;
      }

      DocService.POST.registerDocument(data, (res) => {
        if (res && res.success) {
          let documentId = res.documentId;
          let owner = res.accountId;
          let signedUrl = res.signedUrl;

          this.fileUpload({
            file: fileInfo.file,
            fileid: documentId,
            fileindex: 1,
            ext: fileInfo.ext,
            owner: owner,
            signedUrl: signedUrl,
            callback: progress
          }).then((_res) => {
            callback(res);
          });

        } else if (res && !res.success) {
          let error = JSON.stringify(res);
          console.error("Document Registration Error", error);
        }
      }, (err) => {
        console.error("Document Registration Error", err);
      });
    },
    fileUpload(params) {
      if (params.file == null || params.fileid == null || params.ext == null) {
        console.error("file object is null", params);
        return;
      }
      console.log("fileUpload", params);
      const urlSplits = params.signedUrl.split("?");

      let url = urlSplits[0];
      let search = urlSplits[1];
      let query = JSON.parse("{\"" + search.replace(/&/g, "\",\"").replace(/=/g, "\":\"") + "\"}", function(key, value) {
        return key === "" ? value : decodeURIComponent(value);
      });
      const formData = new FormData();

      formData.append("file", params.file);

      const config = {
        headers: {
          "content-type": "application/octet-stream",
          "Signature": query.Signature,
          "x-amz-acl": "authenticated-read",
        },
        onUploadProgress: (e) => {
          if (e.load !== null && params.callback !== null) {
            //console.log("onUploadProgress : " + e.loaded + "/" + e.total);
            params.callback(e);
          }
        }
      };
      return axios.put(url, params.file, config);
    },
    sendVoteInfo(ethAccount, curatorId, voteAmount, document, transactionResult, callback, error) {
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
    },
    getTrackingInfo(cid, documentId, callback) {
      const data = { cid: cid, documentId: documentId };
      //console.log("getTrackingInfo", data);
      DocService.GET.trackingInfo(data, (result) => {
        callback(result);
      });
    },
    getTrackingList(documentId, callback) {
      const data = { documentId: documentId };
      //console.log("getTrackingList", data);
      DocService.GET.trackingList(data, (result) => {
        callback(result);
      });
    },
    getDocument(documentId, callback) {
      DocService.GET.document(documentId, (result) => {
        let document = new Document(result);
        callback(document);
      });
    },
    getTagList(callback, error) {
      DocService.GET.tagList(result => {
        let tagList = new TagList((result));
        callback(tagList);
      });
    },
    getDocumentList(params, callback, error) {
      DocService.POST.documentList(params, (result) => {
        let documents = new DocumentList(result);
        callback(documents);
      }, (err) => {
        error(err);
      });
    },
    getCuratorDocuments(params, callback, error) {
      let key = null;
      if (params.nextPageKey) {
        key = btoa(JSON.stringify(params.nextPageKey));
        console.log(params, " base64 encoded to ", key);
      } else {
        //console.log("first page");
      }

      DocService.POST.curatorDocuments(params, (result) => {
        let curatorDocuments = new CuratorDocuments(result);
        callback(curatorDocuments);
      }, (err) => {
        error(err);
      });
    },
    getTodayVotedDocumentsByCurator(params, callback, error) {
      const data = {
        accountId: params.accountId
      };
      DocService.POST.todayVotedDocumentsByCurator(data, (result) => {
        callback(result);
      });
    },
    getAnalyticsList(params, callback){
      const data = {
        csv: true,
        userid: null,
        week: params.week,
        documentId: params.documentId
      };
      DocService.GET.analyticsList(data, (result) => {
        let analyticsList = new AnalyticsList(result);
        callback(analyticsList);
      });
    }
  }
};