# Deploy
## Build
- npm run build
- npm run deploy (aws s3 sync build/ s3://share.decompany.io)

## Cloud Front Invaildate
- npm run invaildate

# Lib

## Drizzle

webapp과 MetaMask와의 연동를 위한 library
현재 프로젝트에서 Document Registration 및 Voting 에서 사용되고 있음
 - reference : https://truffleframework.com/drizzle

 ### 참고 소스
 - /src/apis/DrizzleApis.js


## Web3.js

ethereum network와의 통신을 위해 사용함, 현재 프로젝트에서는 Read위주의 Transcation을 처리하고 있음
### 구현 소스 
 - /src/apis/Web3Apis.js

### 참고자료
 - https://github.com/ethereum/web3.js

## Auth0

인증 및 계정 관리를 위한 솔루션 

### 참고자료

 - https://auth0.com/docs/

### 참고소스

 - /src/auth/auth.js : Auth0와 연동을 위한 js
 - /src/apis/AuthApis.js : JWT를 기반으로한 Authed Backend Rest API 모음 js

- MainRoutes.js 초기 로딩 및 인증/로그아웃 연동

```javascript
const auth = new Auth();
//auth.login(true);

const handleAuthentication = ({location}) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
}

const handleLogout = ({location}) => {
  auth.logout();
}
```

## Hubspot & Google Analytics

Hubspot page view tracking을 위한 플러그인

### 적용

- /public/index.html script 삽입

```html
<!-- Start of HubSpot Embed Code -->
<script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/5278394.js"></script>
<!-- End of HubSpot Embed Code -->

```

- MainRoutes.js

```javascript
import ReactGA from 'react-ga';

//hubspot tracking
var _hsq = window._hsq = window._hsq || [];

// GA
if (process.env.NODE_ENV != 'production') {
  ReactGA.initialize('UA-129300994-1', {
    debug: false,
    gaOptions: {
      env: process.env.NODE_ENV
    }
  });
  console.log("google analytics on!!!", process.env)
} else {
  console.log("google analytics off!!!")
}
```

```javascript

componentDidMount() {
    this.sendPageView(history.location);
    history.listen(this.sendPageView);
}

sendPageView(location) {
    //hubspot tracking
    console.log("Tracking sendPageView event", window.location.pathname + window.location.search)
    _hsq.push(['setPath', window.location.pathname + window.location.search]);
    _hsq.push(['trackPageView']);

    //GA
    ReactGA.pageview(window.location.pathname + window.location.search);
}

```
