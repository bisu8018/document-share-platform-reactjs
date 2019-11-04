# Guide


## Architecture
Full Architecture
> https://drive.google.com/file/d/1Q94ubwcRWHg7zRoyrFPLPckq-Y0NzQHV/view?usp=sharing

<br>

Client Architecture
> https://www.polarisoffice.com/d/2RQQv3Kt


## Quick start
1. Make sure that you have Node.js v8.10 and npm v5 or above installed.
2. Run <b>"npm install"</b>  in order to install dependencies.
3. At this point you can run <b>"npm start"</b> or <b>"npm run start"</b> to see the example app at http://localhost:8000.

## Main library
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

## BlockChain library
- web3 (https://www.npmjs.com/package/web3)
- drizzle (https://www.npmjs.com/package/drizzle)

## Note
- This project is a reactive web production using the Google material UI library.
- Using <b>Redux</b> with Thunk(https://www.npmjs.com/package/redux-thunk) and StoreLogger middleware 
- Only create a container when you need to use <b>Redux</b>.
- When block chain is not used, delete and comment block chain related functions such as <b>web3</b> and <b>drizzle</b>.
- Specifying the URL for each environment variable in <b>app.properties.js</b>
- <b>AXIOS</b> was used to communicate with the server.
<br>(Ref : https://github.com/decompanyio/decompanyio-front-end/tree/master/src/service)

- Communicate with all servers through <b>MainRepository.js</b>
<br>(Ref : https://github.com/decompanyio/decompanyio-front-end/blob/master/src/redux/MainRepository.js)

- Applied to <b>model</b> for all <b>GET response data</b> 
<br>(Ref : https://github.com/decompanyio/decompanyio-front-end/tree/master/src/redux/model)  

- <b>SCSS</b> was used. 
<br>(Ref : https://github.com/decompanyio/decompanyio-front-end/blob/master/src/assets/scss/index.scss)
