import ReactGA from "react-ga";
import auth0 from "auth0-js";
import axios from "axios";
import { AUTH_CONFIG } from "../properties/auth.properties";
import { APP_PROPERTIES } from "../properties/app.properties";

import DocService from "../service/DocService";
import AuthService from "../service/AuthService";
import CuratorService from "../service/CuratorService";
import TrackingService from "../service/TrackingService";
import AnalyticsService from "../service/AnalyticsService";
import TagService from "../service/TagService";
import Graphql from "../service/Graphql";

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
import CuratorSummary from "./model/CuratorSummary";
import AccountInfo from "./model/AccountInfo";
import common_view from "../common/common_view";
import mutations from "../service/mutations";
import queries from "../service/queries";
//import * as Sentry from '@sentry/browser';

let instance: any;
let ssr = APP_PROPERTIES.ssr;

export default {
  init(callback: () => any) {
    // 자기 참조
    instance = this;

    //Google Analytics 초기화
    let gaId = process.env.NODE_ENV_SUB === "production" ? "UA-140503497-1" : "UA-129300994-1";
    if (process.env.NODE_ENV_SUB === "production" || process.env.NODE_ENV_SUB === "development") {
      ReactGA.initialize(gaId, {
        debug: false,
        gaOptions: {
          env: process.env.NODE_ENV_SUB
        }
      });
    }

    //로그인 체크
    if (instance.Account.isAuthenticated()) instance.Account.scheduleRenewal();
    else instance.Account.clearSession();


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

    // 메타마스크 관련 체크
    if (!ssr && (typeof window.ethereum !== "undefined" || (typeof window.web3 !== "undefined"))) {
      const ethereum = window["ethereum"] || window.web3.currentProvider;

      ethereum.autoRefreshOnNetworkChange = false;

      // 메타마스크 계정 변경 시, 리로드
      ethereum.on("accountsChanged", accounts => {
        document.location.reload();
      });

      // 메타마스크 네트워크 변경 시, 리로드
      ethereum.on("networkChanged", accounts => {
        document.location.reload();
      });
    }

    callback(true);
  },
  InitData: {
    authData: {},
    hsq: []
  },
  Common: {
    async getToken() {
      const authResult = await instance.Account.renewSessionPromise();
      return authResult.idToken;
    },
    checkNone(res) {
      if (res.length === 0)
        throw new Error("handled");
      else return res;
    }
  },
  Analytics: {
    async getAnalyticsExport(data: any, callback: any) {
      const params = {
        header: { "Authorization": `Bearer ${await instance.Common.getToken()}` },
        params: {
          "documentId": data.documentId,
          "year": data.year,
          "week": data.week
        }
      };

      AnalyticsService.GET.analyticsExport(params, (result) => {
        let analyticsExport = new AnalysticsExport(result);
        callback(analyticsExport);
      });
    },
    async getAnalyticsList(params: any, callback: any) {
      const _params = {
        header: {
          "Authorization": `Bearer ${await instance.Common.getToken()}`
        },
        params: {
          userid: null,
          week: params.week,
          year: params.year,
          documentId: params.documentId
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
      if (isSilentAuthentication) instance.InitData.authData.authorize({ prompt: "none" });
      else instance.InitData.authData.authorize();

    },
    logout() {
      if (ssr) return false;

      this.clearSession();
      this.clearTrackingCookie();

      instance.InitData.authData.logout({
        returnTo: APP_PROPERTIES.domain().mainHost,
        clientID: AUTH_CONFIG.clientId
      });
      window.location.href = "/";
    },
    sync(callback, error) {
      const token = localStorage.getItem("id_token");
      const userInfo = localStorage.getItem("user_info");
      const data = {
        header: { "Authorization": `Bearer ${token}` },
        data: userInfo
      };
      AuthService.POST.sync(data, (result) => callback(result), err => error(err));
    },
    syncUser() {
      const session = this.getSession();
      const idToken = localStorage.getItem("id_token");
      if (idToken && session) {
        this.sync(res => {
          if (res.success) localStorage.setItem("user_sync", JSON.stringify(res));
          else {
            console.error("Login failed because user sync failed.");
            this.logout();
          }
        }, (err) => console.log(err));
      } else console.log("session is not init...");
    },
    isAuthenticated() {
      if (ssr) return false;

      const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
      return new Date().getTime() < expiresAt;
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
      } else if (timeout <= 0) this.logout();
    },
    renewSession() {
      instance.InitData.authData.checkSession({}, (err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setMyInfo(authResult)
            .then(user => this.setSession(authResult, user))
            .catch(err => this.logout());
        } else if (err) {
          this.logout();
          console.error(err);
        }
      });
    },
    renewSessionPromise() {
      return new Promise((resolve, reject) => {
        instance.InitData.authData.checkSession({}, (err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            resolve(authResult);
            this.setMyInfo(authResult).then(user => this.setSession(authResult, user));
          } else if (err) {
            console.log(err);
            this.clearSession();
          }
        });
      });
    },
    handleAuthentication({ location }) {
      return new Promise((resolve, reject) => {
        if (!/access_token|id_token|error/.test(location.hash)) reject();
        instance.InitData.authData.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.setMyInfo(authResult).then(user => {
              this.setSession(authResult, user);
              this.scheduleRenewal();
              this.syncUser();
              resolve(user.sub);
            }).catch(err => reject(err));
          } else if (err) {
            this.clearSession();
            reject(err);
          }
        });
      });
    },
    setMyInfo(authResult) {
      return new Promise((resolve, reject) => {
        instance.InitData.authData.client.userInfo(authResult.accessToken, (err, user) => {
          if (err) {
            //console.error('Getting userInfo', err);
            reject(console.error(`Error: ${err.error}. Getting UserInfo`));
          } else {
            //console.log('Getting Userinfo Success!!', { user, authResult });
            resolve(user);
          }
        });
      });
    },
    setSession(authResult, userInfo) {
      let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      localStorage.setItem("access_token", authResult.accessToken);
      localStorage.setItem("id_token", authResult.idToken);
      localStorage.setItem("expires_at", expiresAt);

      if (userInfo) localStorage.setItem("user_info", JSON.stringify(userInfo));
    },
    async getAccountInfo(id) {
      const data = {
        header: { "Authorization": `Bearer ${await instance.Common.getToken()}` },
        params: { "id": id }
      };

      return AuthService.GET.accountInfo(data)
        .then(result => {
          let accountInfo = new AccountInfo(result);
          accountInfo.user = new UserInfo(result.user);
          return accountInfo;
        }).catch(err => {
          this.logout();
          return err;
        });
    },
    getProfileInfo(params) {
      return AuthService.GET.profileGet(params)
        .then(result => {
          if (result.user) return new UserInfo(result.user);
          else return result;
        })
        .catch(err => err);
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

      if (!userInfo && !this.isAuthenticated()) return "";

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
    async getProfileImageUploadUrl() {
      const _data = {
        header: { "Authorization": `Bearer ${await instance.Common.getToken()}` }
      };

      return AuthService.POST.profileImageUpdate(_data)
        .then(result => new UserProfile(result))
        .catch(err => err);
    },
    async syncEthereum(ethAccount: string, callback) {
      const _data = {
        header: { "Authorization": `Bearer ${await instance.Common.getToken()}` },
        data: { "ethAccount": ethAccount }
      };
      AuthService.POST.ethereumSync(_data, (res, error) => {
        this.renewSession();
        callback(res);
      });
    },
    async updateUsername(username: string, callback) {
      const _data = {
        header: { "Authorization": `Bearer ${await instance.Common.getToken()}` },
        data: { "username": username }
      };
      AuthService.POST.accountUpdate(_data, () => {
        this.renewSession();
        callback();
      });
    },
    async updateProfileImage(url: string, callback) {
      const _data = {
        header: { "Authorization": `Bearer ${await instance.Common.getToken()}` },
        data: { "picture": url }
      };
      AuthService.POST.accountUpdate(_data, () => {
        this.renewSession();
        callback();
      });
    },
    profileImageUpload(params, callback, error) {
      if (params.file == null) return console.error("file object is null", params);

      axios.put(params.signedUrl, params.file)
        .then(response => callback(response))
        .catch(err => error(err));
    },
    clearSession() {
      // Auth0 API
      localStorage.removeItem("access_token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("expires_at");
      localStorage.removeItem("user_info");

      // Tracking API
      localStorage.removeItem("tracking_info");

      // Content Editor
      localStorage.removeItem("content");
    },
    clearTrackingCookie() {
      //Google Analystics,
      common_view.deleteCookie("_ga");
      common_view.deleteCookie("_gid");
    },
    async getDocuments(data: any) {
      const params = {
        header: { "Authorization": `Bearer ${await instance.Common.getToken()}` },
        params: {
          "pageSize": data.pageSize,
          "pageNo": data.pageNo
        }
      };

      return AuthService.GET.documents(params)
        .then(result => new DocumentList((result)))
        .catch(err => err);
    }
  },
  Document: {
    async registerDocument(args: any, progress: any, callback: any, error: any) {
      let fileInfo = args.fileInfo,
        user = args.userInfo,
        ethAccount = args.ethAccount,
        tags = args.tags,
        title = args.title,
        desc = args.desc,
        useTracking = args.useTracking,
        forceTracking = args.forceTracking,
        isDownload = args.isDownload,
        cc = args.cc;

      const data = {
        header: { "Authorization": `Bearer ${await instance.Common.getToken()}` },
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
          isPublic: false,
          cc: cc
        }
      };

      if (!fileInfo.file) return console.error("The registration value(file or metadata) is invalid.", fileInfo);

      DocService.POST.registerDocument(data, (res) => {
        if (res && res.success && !res.code) {
          let documentId = res.documentId,
            owner = res.accountId,
            signedUrl = res.signedUrl;

          this.documentUpload({
            file: fileInfo.file,
            fileid: documentId,
            fileindex: 1,
            ext: fileInfo.ext,
            owner: owner,
            signedUrl: signedUrl,
            callback: progress
          }).then(() => callback(res))
            .catch(err => error(err));

        } else callback(res);
      }, (err) => error(err));
    },
    documentUpload(params) {
      if (params.file == null || params.fileid == null || params.ext == null)
        return console.error("file object is null", params);

      const config = {
        onUploadProgress: (e) => {
          if (e.load !== null && params.callback !== null) {
            //console.log('onUploadProgress : ' + e.loaded + '/' + e.total);
            params.callback(e);
          }
        }
      };
      return axios.put(params.signedUrl, params.file, config);

    },
    getDocument(documentId: string) {
      return DocService.GET.document(documentId).then(result => {
        if (!result.message) return new Document(result);
        else throw new Error(result.message);
      }).catch(err => err);
    },
    getTagList(path: String) {
      return TagService.GET.tagList({ t: path })
        .then(result => new TagList(result))
        .catch(err => err);
    },
    getDocumentList(params: any) {
      return DocService.GET.documentList(params)
        .then(result => new DocumentList(result))
        .catch(err => err);
    },
    getDocumentDownloadUrl(params: any) {
      return DocService.GET.documentDownload(params)
        .then(result => new DocumentDownload(result))
        .catch(err => err);
    },
    getTodayVotedDocumentsByCurator(params: any, callback: any) {
      DocService.POST.todayVotedDocumentsByCurator({ accountId: params.accountId }, (result) => callback(result));
    },
    async updateDocument(data: any) {
      const _data = {
        header: { "Authorization": `Bearer ${await instance.Common.getToken()}` },
        data: {
          documentId: data.documentId,
          desc: data.desc,
          title: data.title,
          tags: data.tags,
          useTracking: data.useTracking,
          forceTracking: data.forceTracking,
          isDownload: data.isDownload,
          cc: data.cc
        }
      };
      return DocService.POST.updateDocument(_data)
        .then(rst => new DocumentInfo(rst.result))
        .catch(error => console.error(error));
    },
    async publishDocument(data: any) {
      const _data = {
        header: { "Authorization": `Bearer ${await instance.Common.getToken()}` },
        data: data
      };

      return DocService.POST.updateDocument(_data)
        .then(rst => new DocumentInfo(rst.result))
        .catch(error => console.error(error));
    },
    async deleteDocument(data: any) {
      const _data = {
        header: { "Authorization": `Bearer ${await instance.Common.getToken()}` },
        data: data
      };
      return DocService.POST.updateDocument(_data)
        .then(rst => new DocumentInfo(rst.result))
        .catch(error => console.error(error));
    },
    getMyList: async data => instance.Query.getMyListFindMany(data)
      .then(res => instance.Common.checkNone(res))
      .then(res => res.map(v => "\"" + v.documentId + "\""))
      .then(res => instance.Query.getDocumentListByIds(res))
      .then(res => {
        let resultData = res;
        resultData.Document.findByIds = res.Document.findByIds.filter(l => {
          let latestArr = res.DocumentFeatured.findByIds.filter(f => f._id === l._id)[0];
          return latestArr ? l.latestVoteAmount = latestArr.latestVoteAmount : true;
        });
        return resultData;
      })
      .then(res => {
        let resultData = res;
        resultData.Document.findByIds = res.Document.findByIds.filter(l => {
          let latestArr = res.DocumentPopular.findByIds.filter(p => p._id === l._id)[0];
          return latestArr ? l.latestPageview = latestArr.latestPageview : true;
        });
        return resultData.Document.findByIds;
      })
      .then(async res => {
        let ids = res.map(v => "\"" + v.accountId + "\"");
        let userData = await instance.Query.getUserByIds(ids);
        return res.filter(v => {
          let idx = -1;
          userData.map((u, i) => (idx === -1 && u._id === v.accountId) ? idx = i : -1);
          return idx !== -1 ? v.author = userData[idx] : v;
        });
      }),
    getHistory: async data => instance.Query.getHistoryFindById(data)
      .then(res => instance.Common.checkNone(res))
      .then(res => res.map(v => v.documentId))
      .then(res => instance.Query.getDocumentListByIdsMultiple(res))
      .then(res => {
        const resultData = Object({
          Document: [],
          DocumentFeatured: [],
          DocumentPopular: []
        });
        let arrLength = Object.keys(res).length / 3;
        for (let i = 0; i < arrLength; ++i) {
          if (res["latest_" + i].findOne) resultData.Document.push(res["latest_" + i].findOne);
          if (res["featured_" + i].findOne) resultData.DocumentFeatured.push(res["featured_" + i].findOne);
          if (res["popular_" + i].findOne) resultData.DocumentPopular.push(res["popular_" + i].findOne);
        }
        return resultData;
      })
      .then(res => {
        let resultData = res;
        resultData.Document = res.Document.filter(l => {
          let latestArr = res.DocumentFeatured.filter(f => f._id === l._id)[0];
          return latestArr ? l.latestVoteAmount = latestArr.latestVoteAmount : true;
        });
        return resultData;
      })
      .then(res => {
        let resultData = res;
        resultData.Document = res.Document.filter(l => {
          let latestArr = res.DocumentPopular.filter(p => p._id === l._id)[0];
          return latestArr ? l.latestPageview = latestArr.latestPageview : true;
        });
        return resultData.Document;
      })
      .then(async res => {
        let ids = res.map(v => "\"" + v.accountId + "\"");
        let userData = await instance.Query.getUserByIds(ids);
        return res.filter(v => {
          let idx = -1;
          userData.map((u, i) => (idx === -1 && u._id === v.accountId) ? idx = i : -1);
          return idx !== -1 ? v.author = userData[idx] : v;
        });
      })
  },
  Curator: {
    async getCuratorDocuments(params: any, callback: any, error: any) {
      CuratorService.GET.curatorDocuments(params
        , result => callback(new CuratorDocuments(result))
        , err => error(err));
    },
    async getCuratorSummary(ethAccount: String) {
      const params = { ethAccount: ethAccount };

      return new Promise((resolve, reject) => {
        CuratorService.GET.curatorSummary(params
          , res => resolve(new CuratorSummary(res))
          , err => reject(err));
      });
    }
  },
  Tracking: {
    postTrackingConfirm(data) {
      return TrackingService.POST.trackingConfirm(data);
    },
    async getTrackingInfo(data: any, callback: any, error: any) {
      const params = {
        header: { "Authorization": `Bearer ${await instance.Common.getToken()}` },
        params: {
          "cid": data.cid,
          "documentId": data.documentId,
          "include": data.include,
          "anonymous": data.anonymous
        }
      };
      TrackingService.GET.trackingInfo(params
        , result => callback(result)
        , err => error(err));
    },
    async getTrackingList(data: any, callback: any, error: any) {
      const params = {
        header: { "Authorization": `Bearer ${await instance.Common.getToken()}` },
        params: data
      };

      TrackingService.GET.trackingList(params
        , result => callback(result)
        , err => error(err));
    },
    async getTrackingExport(documentId: string, callback: any) {
      const params = {
        header: { "Authorization": `Bearer ${await instance.Common.getToken()}` },
        params: { "documentId": documentId }
      };

      TrackingService.GET.trackingExport(params, result => callback(new TrackingExport(result)));
    }
  },
  Mutation: {
    addMyList: async data => Graphql({
      header: { "Authorization": `Bearer ${await instance.Common.getToken()}` },
      mutation: mutations.addMyList(data)
    }).then(res => res),
    removeMyList: async data => Graphql({
      header: { "Authorization": `Bearer ${await instance.Common.getToken()}` },
      mutation: mutations.removeMyList(data)
    }).then(res => res),
    addHistory: async data => Graphql({
      header: { "Authorization": `Bearer ${await instance.Common.getToken()}` },
      mutation: mutations.addHistory(data)
    }).then(res => res)
  },
  Query: {
    getMyListFindMany: async data => Graphql({
      query: queries.getMyListFindMany(data)
    }).then(res => res.UserDocumentFavorite.findMany),
    getHistoryFindById: async data => Graphql({
      query: queries.getHistoryFindById(data)
    }).then(res => res.UserDocumentHistory.findMany),
    getDocumentListByIds: async data => Graphql({
      query: queries.getDocumentListByIds(data)
    }).then(res => res),
    getDocumentListByIdsMultiple: async data => Graphql({
      query: data.map((v, i) =>
        `\nlatest_` + i + `: ` + queries.getDocumentByFindOne(v) +
        `\nfeatured_` + i + `: ` + queries.getDocumentFeaturedByFindOne(v) +
        `\npopular_` + i + `: ` + queries.getDocumentPopularByFindOne(v)
      )
    }).then(res => res),
    getUserByIds: async data => Graphql({
      query: queries.getUserByIds(data)
    }).then(res => res.User.findByIds)
  }
};
