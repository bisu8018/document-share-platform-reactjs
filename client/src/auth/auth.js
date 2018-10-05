import history from '../history';
import auth0 from 'auth0-js';
import { AUTH_CONFIG } from '../resources/auth.properties';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    responseType: 'token id_token',
    scope: 'openid profile email'
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.setSession = this.setSession.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  logout = () => {
    this.clearSession();
    this.auth0.logout({
      returnTo: 'http://localhost:3000',
      clientID: AUTH_CONFIG.clientId
    });

  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {

      console.log("handleAuthentication", authResult, this);
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.auth0.client.userInfo(authResult.accessToken, (err, user) => {
          if(err){
              alert('Error: ${err.error}. Getting UserInfo');
          } else {
              console.log('Getting Userinfo Success!!', {user, authResult});
              this.setSession(authResult, user);
          }
          history.replace('/');

        });

      } else if (err) {
        history.replace('/');
        console.log(err);
        alert('Error: ${err.error}. Check the console for further details.');
      }
    });
  }


  handleLogout() {
    alert("handleLogout()");
    this.clearSession();
    // navigate to the home route
    history.replace('/');
  }

  setSession(authResult, userInfo) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    localStorage.setItem('user_info', JSON.stringify(userInfo));
  }

  getSession() {

    return {
      accessToken: localStorage.getItem('access_token'),
      idToken: localStorage.getItem('id_token'),
      userInfo: JSON.parse(localStorage.getItem('user_info'))
    }
  }

  getUserInfo = () => {
    const userInfo = JSON.parse(localStorage.getItem('user_info'));
    //console.log(userInfo);
    return userInfo;
  }

  clearSession() {
    console.log("clear session", localStorage);
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user_info');
  }



  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time

    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    //console.log("expiresAt", new Date(expiresAt), localStorage);
    return new Date().getTime() < expiresAt;
  }
}
