import ReactGA from "react-ga";
import auth0 from "auth0-js";
import axios from "axios";
//import * as Sentry from "@sentry/browser";

import { AUTH_CONFIG } from "properties/auth.properties";
import { APP_PROPERTIES } from "properties/app.properties";

import DocService from "../service/DocService";
import AuthService from "../service/AuthService";

import DocumentList from "./model/DocumentList";
import Document from "./model/Document";
import CuratorDocuments from "./model/CuratorDocuments";
import TagList from "./model/TagList";
import AnalyticsList from "./model/AnalyticsList";
import DocumentInfo from "./model/DocumentInfo";
import UserInfo from "./model/UserInfo";
import TrackingExport from "./model/TrackingExport";
import AnalysticsExport from "./model/AnalysticsExport";
import UserProfile from "./model/UserProfile";
import DocumentDownload from "./model/DocumentDownload";
import Common from "../util/Common";
import CuratorService from "../service/CuratorService";
import TrackingService from "../service/TrackingService";
import CuratorSummary from "./model/CuratorSummary";
import AnalyticsService from "../service/AnalyticsService";

let instance: any;

export default {
  init(callback: () => any) {
    instance = this;    // 자기 참조

    //센트리 초기화
  /*  Sentry.init({
      dsn: "https://6dfadc862ca64af08fd6b39ade991deb@sentry.io/1450741"
    });
*/
    //Google Analytics 초기화
    //UA-129300994-1 : share
    //UA-140503497-1 : polaris
    let gaId = process.env.NODE_ENV === "production" ? "UA-140503497-1" : "UA-129300994-1";
    if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "dev") {
      ReactGA.initialize(gaId, {
        debug: false,
        gaOptions: {
          env: process.env.NODE_ENV
        }
      });
    }

    //로그인 체크
    if (instance.Account.isAuthenticated()) {
      instance.Account.scheduleRenewal();
    } else {
      instance.Account.clearSession();
    }

    //허브스팟 초기화
    instance.InitData.hsq = window._hsq = window._hsq || [];

    //Auth0 초기화
    instance.InitData.authData = new auth0.WebAuth({
      domain: AUTH_CONFIG.domain,
      clientID: AUTH_CONFIG.clientId,
      redirectUri: AUTH_CONFIG.callbackUrl,
      responseType: "token id_token",
      scope: "openid profile email"
    });

    callback(true);
  },
  InitData: {
    authData: {},
    hsq: []
  },
  Analytics: {
    async getAnalyticsExport(data: any, callback: any) {
      const authResult = await instance.Account.renewSessionPromise();
      const token = authResult.idToken;
      const params = {
        header: {
          "Authorization": `Bearer ${token}`
        },
        params: {
          "documentId": data.documentId,
          "year": data.year,
          "week": data.week
        }
      };

      DocService.GET.analyticsExport(params, (result) => {
        let analysticsExport = new AnalysticsExport(result);
        callback(analysticsExport);
      });
    },
    async getAnalyticsList(params: any, callback: any) {
      const authResult = await instance.Account.renewSessionPromise();
      let token = authResult.idToken;
      const _params = {
        params: {
          userid: null,
          week: params.week,
          year: params.year,
          documentId: params.documentId
        },
        header: {
          "Authorization": `Bearer ${token}`
        }
      };
      AnalyticsService.GET.analyticsList(_params, (result) => {
        let analyticsList = new AnalyticsList(result);
        callback(analyticsList);
      });
    },
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
    logout(callback) {
      this.clearSession();
      this.clearTrackingCookie();

      instance.InitData.authData.logout({
        returnTo: APP_PROPERTIES.domain().mainHost,
        clientID: AUTH_CONFIG.clientId
      });
      callback();
    },
    sync(callback, error) {
      const token = localStorage.getItem("id_token");
      const userInfo = localStorage.getItem("user_info");
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
      const idToken = localStorage.getItem("id_token");
      if (idToken && session) {
        this.sync(res => {
          if (res.success) {
            localStorage.setItem("user_sync", JSON.stringify(res));
          } else {
            console.error("Login failed because user sync failed.");
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
      const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
      const isUnExpired = new Date().getTime() < expiresAt;

      if (!isUnExpired) {
        //console.error("Session Expired", expiresAt, sessionStorage);
        this.clearSession();
      }
      return isUnExpired;
    },
    scheduleRenewal() {
      let expiresAt = JSON.parse(localStorage.getItem("expires_at"));
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
          this.setMyInfo(authResult, user => {
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
            this.setMyInfo(authResult, user => {
              this.setSession(authResult, user);
            });
          } else if (err) {
            console.log(err);
            this.clearSession();
            window.location.reload();
          }
        });
      });
    },
    handleAuthentication({ location }, callback) {
      if (/access_token|id_token|error/.test(location.hash)) {
        instance.InitData.authData.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            //console.log("handleAuthentication", authResult, err);
            this.setMyInfo(authResult, user => {
              this.setSession(authResult, user);
              this.scheduleRenewal();
              this.syncUser();
              callback();
            });
          } else if (err) {
            this.clearSession();
          }
        });
      }
    },
    setMyInfo(authResult, callback) {
      instance.InitData.authData.client.userInfo(authResult.accessToken, (err, user) => {
        if (err) {
          //console.error("Getting userInfo", err);
          console.error(`Error: ${err.error}. Getting UserInfo`);
        } else {
          //console.log("Getting Userinfo Success!!", { user, authResult });
          callback(user);
        }
      });
    },
    setSession(authResult, userInfo) {
      let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      localStorage.setItem("access_token", authResult.accessToken);
      localStorage.setItem("id_token", authResult.idToken);
      localStorage.setItem("expires_at", expiresAt);
      if (userInfo) {
        localStorage.setItem("user_info", JSON.stringify(userInfo));
      }
    },
    async getAccountInfo(id, callback, error) {
      const authResult = await instance.Account.renewSessionPromise();
      let token = authResult.idToken;
      const data = {
        header: {
          "Authorization": `Bearer ${token}`
        },
        params: {
          "id": id
        }
      };

      AuthService.GET.accountInfo(data, (result => {
        let userInfo = new UserInfo(result.user);
        callback(userInfo);
      }), err => {
        error(err);
      });
    },
    getProfileInfo(params, callback, error) {
      AuthService.GET.profileGet(params, (result => {
        let userInfo = null;
        if (result.user) {
          userInfo = new UserInfo(result.user);
          callback(userInfo);
        } else {
          error(result.message);
        }
      }), err => {
        error(err);
      });
    },
    getMyInfo() {
      let userInfo = JSON.parse(localStorage.getItem("user_info"));
      if (!userInfo && this.isAuthenticated()) {
        this.renewSession();
        return {};
      }
      return new UserInfo(userInfo);
    },
    getExpireDate() {
      let expiresAt = JSON.parse(localStorage.getItem("expires_at"));
      if (!expiresAt && this.isAuthenticated()) {
        this.renewSession();
        return {};
      }
      return JSON.stringify(new Date(expiresAt));
    },
    getMyEmail() {
      let userInfo = JSON.parse(localStorage.getItem("user_info"));

      if (!userInfo && !this.isAuthenticated()) {
        return "";
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
          accessToken: localStorage.getItem("access_token"),
          idToken: localStorage.getItem("id_token"),
          userInfo: JSON.parse(localStorage.getItem("user_info")),
          expiresAt: JSON.parse(localStorage.getItem("expires_at"))
        });
    },
    async getProfileImageUploadUrl(callback, error) {
      const authResult = await instance.Account.renewSessionPromise();
      let token = authResult.idToken;
      const _data = {
        header: {
          "Authorization": `Bearer ${token}`
        }
      };
      AuthService.POST.profileImageUpdate(_data, (result) => {
        let userProfile = new UserProfile(result);
        callback(userProfile);
      }, err => {
        error(err);
      });
    },
    async syncEthereum(ethAccount: string, callback) {
      const authResult = await instance.Account.renewSessionPromise();
      let token = authResult.idToken;
      const _data = {
        header: {
          "Authorization": `Bearer ${token}`
        },
        data: {
          "ethAccount": ethAccount
        }
      };
      AuthService.POST.ethereumSync(_data, (res) => {
        this.renewSession();
        callback(res);
      });
    },
    async updateUsername(username: string, callback) {
      const authResult = await instance.Account.renewSessionPromise();
      let token = authResult.idToken;
      const _data = {
        header: {
          "Authorization": `Bearer ${token}`
        },
        data: {
          "username": username
        }
      };
      AuthService.POST.accountUpdate(_data, () => {
        this.renewSession();
        callback();
      });
    },
    async updateProfileImage(url: string, callback) {
      const authResult = await instance.Account.renewSessionPromise();
      let token = authResult.idToken;
      const _data = {
        header: {
          "Authorization": `Bearer ${token}`
        },
        data: {
          "picture": url
        }
      };
      AuthService.POST.accountUpdate(_data, () => {
        this.renewSession();
        callback();
      });
    },
    profileImageUpload(params, callback, error) {
      if (params.file == null) {
        console.error("file object is null", params);
        return;
      }
      const urlSplits = params.signedUrl.split("?");

      let url = urlSplits[0];
      let search = urlSplits[1];
      let query = JSON.parse("{\"" + search.replace(/&/g, "\",\"").replace(/=/g, "\":\"") + "\"}", function(key, value) {
        return key === "" ? value : decodeURIComponent(value);
      });

      const config = {
        headers: {
          "content-type": params.file.type,
          "Signature": query.Signature,
          "x-amz-acl": "authenticated-read"
        }
      };
      axios.put(url, params.file, config)
        .then(
          response => {
            callback(response);
          }
        )
        .catch(
          err => {
            error(err);
          }
        );
    },
    clearSession() {
      //Auth0 API
      localStorage.removeItem("access_token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("expires_at");
      localStorage.removeItem("user_info");
    },
    clearTrackingCookie() {
      //Google Analystics,
      Common.deleteCookie("_ga");
      Common.deleteCookie("_gid");
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
      let forceTracking = args.forceTracking;
      let isDownload = args.isDownload;
      let token = authResult.idToken;

      const data = {
        data: {
          filename: fileInfo.file.name,
          size: fileInfo.file.size,
          username: user.userName,
          sub: user.sub,
          ethAccount: ethAccount,
          title: title,
          desc: desc,
          tags: tags,
          useTracking: useTracking,
          forceTracking: forceTracking,
          isDownload: isDownload,
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

          this.documentUpload({
            file: fileInfo.file,
            fileid: documentId,
            fileindex: 1,
            ext: fileInfo.ext,
            owner: owner,
            signedUrl: signedUrl,
            callback: progress
          }).then(() => {
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
    documentUpload(params) {
      if (params.file == null || params.fileid == null || params.ext == null) {
        console.error("file object is null", params);
        return;
      }
      const urlSplits = params.signedUrl.split("?");

      let url = urlSplits[0];
      let search = urlSplits[1];
      let query = JSON.parse("{\"" + search.replace(/&/g, "\",\"").replace(/=/g, "\":\"") + "\"}", function(key, value) {
        return key === "" ? value : decodeURIComponent(value);
      });

      const config = {
        headers: {
          "content-type": "application/octet-stream",
          "Signature": query.Signature,
          "x-amz-acl": "authenticated-read"
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
    getDocument(documentId: string, callback: any, error: any) {
      DocService.GET.document(documentId, (result) => {
        if (!result.message) {
          let document = new Document(result);
          callback(document);
        } else {
          error(result.message);
        }
      });
    },
    getTagList(path:String, callback: any) {
      let params = {
        t : path
      };
      DocService.GET.tagList(params,result => {
        let tagList = new TagList((result));
        callback(tagList);
      });
    },
    getDocumentList(params: any, callback: any) {
      DocService.GET.documentList(params, result => {
        let documentList = new DocumentList((result));
        callback(documentList);
      });
    },
    getDocumentDownloadUrl(params: any, callback: any) {
      DocService.GET.documentDownloadUrl(params, result => {
        let documentDownload = new DocumentDownload(result);
        callback(documentDownload);
      });
    },
    getTodayVotedDocumentsByCurator(params: any, callback: any) {
      const data = {
        accountId: params.accountId
      };
      DocService.POST.todayVotedDocumentsByCurator(data, (result) => {
        callback(result);
      });
    },
    async updateDocument(data: any, callback: any) {
      const authResult = await instance.Account.renewSessionPromise();
      let token = authResult.idToken;
      const _data = {
        data: {
          documentId: data.documentId,
          desc: data.desc,
          title: data.title,
          tags: data.tags,
          useTracking: data.useTracking,
          forceTracking: data.forceTracking,
          isDownload: data.isDownload,
        },
        header: {
          "Authorization": `Bearer ${token}`
        }
      };
      DocService.POST.updateDocument(_data, (rst) => {
        let documentInfo = new DocumentInfo(rst.result);
        callback(documentInfo);
      }, error => {
        console.error(error);
      });
    }
  },
  Curator: {
    async getCuratorDocuments(params: any, callback: any, error: any) {
      CuratorService.GET.curatorDocuments(params, (result) => {
        let curatorDocuments = new CuratorDocuments(result);
        callback(curatorDocuments);
      }, (err) => {
        error(err);
      });
    },
    async getCuratorSummary(ethAccount: String, callback: any, error: any) {
      const params = { ethAccount: ethAccount  };
      return new Promise((resolve, reject) => {
        CuratorService.GET.curatorSummary(params, (res) => {
          let curatorSummary = new CuratorSummary(res);
          resolve(curatorSummary);
        }, (err) => {
          reject(err);
        });
      });
    }
  },
  Tracking: {
    postTrackingConfirm(data) {
      return new Promise((resolve) => {
        TrackingService.POST.trackingConfirm(data, (result) => {
          resolve(result);
        });
      })
    },
    async getTrackingInfo(data, callback) {
      const authResult = await instance.Account.renewSessionPromise();
      const token = authResult.idToken;
      const params = {
        header: {
          "Authorization": `Bearer ${token}`
        },
        params: {
          "cid": data.cid,
          "documentId": data.documentId,
          "include": data.include,
          "anonymous": data.anonymous
        }
      };
      TrackingService.GET.trackingInfo(params, (result) => {
        callback(result);
      });
    },
    async getTrackingList(data: any, callback: any) {
      const authResult = await instance.Account.renewSessionPromise();
      const token = authResult.idToken;
      const params = {
        header: {
          "Authorization": `Bearer ${token}`
        },
        params: data
      };
      //console.log("getTrackingList", data);
      TrackingService.GET.trackingList(params, (result) => {
        callback(result);
      });
    },
    async getTrackingExport(documentId: string, callback: any) {
      const authResult = await instance.Account.renewSessionPromise();
      const token = authResult.idToken;
      const params = {
        header: {
          "Authorization": `Bearer ${token}`
        },
        params: {
          "documentId": documentId
        }
      };

      TrackingService.GET.trackingExport(params, (result) => {
        let trackingExport = new TrackingExport(result);
        callback(trackingExport);
      });
    }
  }
};