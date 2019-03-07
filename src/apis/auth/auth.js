import history from "apis/history/history";
import auth0 from "auth0-js";
import { AUTH_CONFIG } from "properties/auth.properties";
import { APP_PROPERTIES } from "properties/app.properties";
import MainRepository from "../../redux/MainRepository";

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    responseType: "token id_token",
    scope: "openid profile email"
  });

  tokenRenewalTimeout;

  expiresAt = -1;

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.setSession = this.setSession.bind(this);

    if (this.isAuthenticated()) {
      this.scheduleRenewal();
    }
  }

  login(isSilentAuthentication) {
    if (isSilentAuthentication) {
      this.auth0.authorize({ prompt: "none" });
    } else {
      this.auth0.authorize();
    }
  }

  logout = () => {
    this.clearSession();
    this.auth0.logout({
      returnTo: APP_PROPERTIES.domain().mainHost,
      clientID: AUTH_CONFIG.clientId
    });
  };

  handleAuthentication() {
    console.log("auth", "handleAuthentication");
    this.auth0.parseHash((err, authResult) => {

      console.log("handleAuthentication", authResult, err);

      if (authResult && authResult.accessToken && authResult.idToken) {
        this.auth0.client.userInfo(authResult.accessToken, (err, user) => {
          if (err) {
            console.error("Getting userInfo", err);
            alert(`Error: ${err.error}. Getting UserInfo`);
          } else {
            console.log("Getting Userinfo Success!!", { user, authResult });
            this.setSession(authResult, user);

            this.syncUser();

            this.scheduleRenewal();

          }
          history.replace("/");
        });
      } else if (err) {
        this.clearSession();
        history.replace("/");
        console.error(err);
        //alert(`Error: ${err.error}. Check the console for further details.`);

      }
    });
  }


  handleLogout = () => {
    alert("handleLogout()");
    this.clearSession();
    // navigate to the home route
    history.replace("/");
  };

  setSession = (authResult, userInfo) => {
    // Set the time that the access token will expire at
    this.expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", this.expiresAt);
    if (userInfo) {
      this.userInfo = userInfo;
      localStorage.setItem("user_info", JSON.stringify(userInfo));
    }

  };

  getSession = () => ({
    accessToken: localStorage.getItem("access_token"),
    idToken: localStorage.getItem("id_token"),
    userInfo: JSON.parse(localStorage.getItem("user_info"))
  });

  syncUser = () => {
    const session = this.getSession();
    const idToken = localStorage.getItem("id_token");
    const userInfo = localStorage.getItem("user_info");
    if (idToken && session) {
      MainRepository.Account.sync(session.idToken, userInfo, (res) => {
        let resData = res;
        if (resData.success) {
          console.log(resData);
          localStorage.setItem("user_sync", JSON.stringify(resData));
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
  };

  getUserInfo = () => {
    const userInfo = JSON.parse(localStorage.getItem("user_info"));
    if (!userInfo) {
      this.renewSession();
      return {};
    }
    return userInfo;
  };

  getEmail = () => {
    const userInfo = JSON.parse(localStorage.getItem("user_info"));
    return userInfo.email;
  };

  clearSession = () => {
    //console.log("clear session", localStorage);
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("user_info");
  };

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    //console.log("isAuthenticated", new Date(expiresAt), localStorage);

    const isUnExpired = new Date().getTime() < expiresAt;
    if (!isUnExpired) {
      //console.error("Session Expired", expiresAt, localStorage);
      this.clearSession();
    }
    return isUnExpired;
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        //console.log("renewSession", authResult);
        this.setSession(authResult);
        this.scheduleRenewal();
      } else if (err) {
        this.logout();
        console.log(err);
        alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
      }
    });
  }


  scheduleRenewal() {

    let expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    const timeout = expiresAt - Date.now(); //mms
    //console.log("scheduleRenewal", expiresAt, timeout, this.tokenRenewalTimeout);
    if (timeout > 0) {
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewSession();
      }, timeout);
    }
  }

  getExpiryDate() {
    const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return JSON.stringify(new Date(expiresAt));
  }
}
