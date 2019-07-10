#가이드


## 아키텍쳐
전체 아키텍쳐
> https://drive.google.com/file/d/1Q94ubwcRWHg7zRoyrFPLPckq-Y0NzQHV/view?usp=sharing

클라이언트 아키텍쳐
> https://www.polarisoffice.com/d/2RQQv3Kt

## 빠른 시작
1. Node.js v8.10,  npm v5 이상 버전으로 설치
2. 터미널에 <b>"npm install"</b> 입력하여 의존 라이브러리 설치
3. <b>"npm start"</b> 또는 <b>"npm run start"</b> 입력하여 로컬환경 앱 실행 (http://localhost:8000)

## 주요 라이브러리
- react (https://reactjs.org/)
- redux (https://redux.js.org/basics/usage-with-react)
- webpack (https://www.npmjs.com/package/webpack)
- material-ui (https://material-ui.com/) 
- axios (https://github.com/axios/axios)
- eslint (https://www.npmjs.com/package/eslint) 
- history (https://www.npmjs.com/package/history)

## 블록체인 라이브러리
- web3 (https://www.npmjs.com/package/web3)
- drizzle (https://www.npmjs.com/package/drizzle)

## 참고사항
- 구글 material UI 라이브러리 사용하여 반응형 웹 제작
- 서버와의 통신은 <b>AXIOS</b> 사용 
<br>(참고 : https://github.com/decompanyio/decompanyio-front-end/tree/master/src/service)
- 모든 서버와의 통신은 <b>MainRepository.js</b> 통하여 수행 
<br>(참고 : https://github.com/decompanyio/decompanyio-front-end/blob/master/src/redux/MainRepository.js)
- 모든 <b>GET response Data</b> 에 대하여 <b>model</b> 적용 
<br>(참고 : https://github.com/decompanyio/decompanyio-front-end/tree/master/src/redux/model)  
- <b>Redux</b> 사용하며, <b>Thunk</b>(https://www.npmjs.com/package/redux-thunk)와 StoreLogger 미들웨어 사용 
- <b>Redux</b> 사용이 필요할 때만 container 생성
- 블록체인 미사용시, <b>web3</b>, <b>drizzle</b> 관련 함수 삭제 및 주석처리 필요
- <b>app.properties.js</b> 에 환경변수 별 URL 명시
