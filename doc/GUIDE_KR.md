# 문서 공유 플랫폼
<image src="./banner.png" style="width: 150px;">
<a href="https://github.com/bisu8018/document-share-platform-reactjs/tree/master/client">
  React js 소스코드 (https://github.com/bisu8018/document-share-platform-reactjs/tree/master/client)
</a><br>
<a href="https://github.com/bisu8018/document-share-platform-reactjs/tree/master/server">
  Web server(Express js) 소스코드 (https://github.com/bisu8018/document-share-platform-reactjs/tree/master/server)
</a>
  
## 아키텍쳐
<image src="./backend-archtecture.png" style="width: 150px;">
<br>

## 개요
### 프로젝트
- 문서 공유 플랫폼 + 수익 실현 가능한 DAPP
- 초기 한국, 영어 지원
- 반응형 웹 개발 
- web3 통한 가상화폐지갑 연동

### 현황
- <a href="https://polarishare.com">Beta 오픈 (https://polarishare.com)</a>

### 구성원 
- PM : 1명
- Front-End : 1명 
- Back-End : 1명

### 기간 
- 2019.4 ~ 2018.10 (약 7개월)

### 주요 기술
- React js 
- ES6
- Express js
- SCSS
- GraphQL
- Web3 + Drizzle js

### 협업 툴
- Github
- Wrike
- Teamview
- Google docs
- Postman
- Zeplin 
<br>

## 특이사항
- 반응형 SPA + SSR 개발
- Web3, Drizzle 연동
- 멀티 브라우져 지원
- 2개국어 지원 (한국어, 영어)
- SEO, oEmbed, Open graph 지원
- Functional Programing 
<br>

## 담당 업무
- 문서 공유 플랫폼 프론트엔드 담당
- React js + Web server (Express) 구축
- Client 가상화폐 지갑 연동 구축 
- AWS EC2 빌드/배포 관리
<br>

## 기여도
- 100%
<br>

## 상세 내용
### 프로젝트 구조
```
document-share-platform-reactjs
│
└───config  // eject 제공 환경설정 파일 (webpack, env ...)
│
└───public
│
└───script  // Web server 빌드 설정/실행 script 파일
│
└───src
    │   index.js  // CSR index 파일
    │   serverRender.js // SSR index 파일
    │
    └───apis  // Smart Contract, thirdparty library 파일
    │
    └───assets  // scss, css, image 파일
    │
    └───common  // 공통 스크립트 파일
    │
    └───components  // 리액트 컴포넌트 파일
    │
    └───config
    │
    └───container // redux 용 컴포넌트 컨테이너 파일
    │
    └───properties
    │
    └───redux
    │   │   MainRepository.js   // AXIOS 통신, 리덕스 get/set controller 파일
    │   │  
    │   └───config  // redux 설정 파일
    │   │  
    │   └───model   // data model 파일
    │   │  
    │   └───reducer   // 리듀서 파일
    │   │  
    │   └───store   // 스토어 파일
    │
    └───service   // AXIOS 관련 파일
```

## 빠른 시작 (로컬)
1. Node.js v8.10,  npm v5 이상 버전으로 설치
2. 터미널에 <b>"npm install"</b> 입력하여 의존 라이브러리 설치
3. <b>"npm start"</b> 또는 <b>"npm run start"</b> 입력하여 로컬환경 앱 실행 (http://localhost:8000)

## 빠른 시작 (로컬 서버)
1. Node.js v8.10,  npm v5 이상 버전으로 설치
2. 터미널에 <b>"npm install"</b> 입력하여 의존 라이브러리 설치
3. <b>"npm run deploy:ssr_local" 입력하여 빌드 파일 생성 
4. decompanyio-web-server 프로젝트 이동 후 "npm start" 입력하여 실행


## 주요 라이브러리
- react (https://reactjs.org/)
- redux (https://redux.js.org/basics/usage-with-react)
- webpack (https://www.npmjs.com/package/webpack)
- material-ui (https://material-ui.com/) 
- axios (https://github.com/axios/axios)
- eslint (https://www.npmjs.com/package/eslint) 
- history (https://www.npmjs.com/package/history)
- css-loader (https://www.npmjs.com/package/css-loader)
- style-loader (https://www.npmjs.com/package/style-loader)
- file-loader (https://www.npmjs.com/package/file-loader)

## 블록체인 라이브러리
- web3 (https://www.npmjs.com/package/web3)
- drizzle (https://www.npmjs.com/package/drizzle)

## 참고사항
- 구글 material UI 라이브러리 사용하여 반응형 웹 제작
- <b>Redux</b> 사용하며, <b>Thunk</b> (https://www.npmjs.com/package/redux-thunk) 와 StoreLogger 미들웨어 사용 
- <b>Redux</b> 사용이 필요할 때만 container 생성
- 블록체인 미사용시, <b>web3</b>, <b>drizzle</b> 관련 함수 삭제 및 주석처리 필요
- <b>app.properties.js</b> 에 환경변수 별 URL 명시

- 서버와의 통신은 <b>AXIOS</b> 사용 
<br>(참고 : https://github.com/decompanyio/decompanyio-front-end/tree/master/src/service)

- 모든 서버와의 통신은 <b>MainRepository.js</b> 통하여 수행 
<br>(참고 : https://github.com/decompanyio/decompanyio-front-end/blob/master/src/redux/MainRepository.js)

- 모든 <b>GET response Data</b> 에 대하여 <b>model</b> 적용 
<br>(참고 : https://github.com/decompanyio/decompanyio-front-end/tree/master/src/redux/model)
  
- <b>SCSS</b> 전처리기 사용 
<br>(참고 : https://github.com/decompanyio/decompanyio-front-end/blob/master/src/assets/scss/index.scss)

