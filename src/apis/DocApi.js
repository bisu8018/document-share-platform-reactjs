import axios from 'axios';
import * as ajax from './CommonAjaxApis';
import { APP_PROPERTIES } from '../resources/app.properties';

const uploadDomain = APP_PROPERTIES.domain().upload + '/prod/upload';
const imgDomain = APP_PROPERTIES.domain().image;
const apiDomain = APP_PROPERTIES.domain().api;

const registDocumentInfoUrl = "/api/document/regist";
const getDocumentsUrl = "/api/document/list";
const getCuratorDocumentsUrl = "/api/curator/document/list";
const getTodayVotedDocumentsByCuratorUrl = "/api/curator/document/today";
const getDocumentUrl = "/api/document/info/";
const getDocumentTextUrl = "/api/document/text/";
const getDocumentDownloadUrl = "/api/document/download/";
const voteDocumentUrl = "/api/document/vote/";
const trackingUrl = "/api/document/tracking";
const trackingInfoUrl = "/api/document/trackinginfo";

function jsonToQueryString(json) {
  return '?' + 
      Object.keys(json).map(function(key) {
          return encodeURIComponent(key) + '=' +
              encodeURIComponent(json[key]);
      }).join('&');
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export function getPageView(documentId, pageNo) {
  //return imgDomain + "/document/get/" + documentId + "/" + pageNo;
  //http://dev-ca-document.s3-website-us-west-1.amazonaws.com/THUMBNAIL/002107e7ce7541fdafa256f50babafff/300X300/1
  return imgDomain + "/THUMBNAIL/" + documentId + "/1200X1200/"  + pageNo;
}

export function getTracking(params) {
  const timestamp = Date.now();
  let trackingInfo = null;
  try{
    trackingInfo = JSON.parse(localStorage.getItem("tracking_info"));
  } catch(e){
    console.error(e);
    
  }

  if(!trackingInfo){
    
    trackingInfo = {
      sid: makeid(),
      cid: makeid(),
      touchAt: timestamp
    }
  }
  
  
  console.log("trackingInfo", trackingInfo);
  
  if(!trackingInfo.sid || timestamp - trackingInfo.touchAt > 1000 * 60 * 20 /**20 min */){
    //sid는 30분 지나면 새로 갱신함
    const sid = makeid();  
    console.log("renew sid", sid);
    trackingInfo.sid =  sid;
  }

  if(!trackingInfo.cid ||timestamp - trackingInfo.touchAt > 1000 * 60 * 60 * 10 /*10 hours */ ){
    //cid는 10시간이 지나면 새로 갱신함
    const cid = makeid();  
    console.log("renew cid", cid);
    trackingInfo.cid =  cid;
  }
  trackingInfo.touchAt = timestamp;

  params.sid = trackingInfo.sid;
  params.cid = trackingInfo.cid;
  params.t = timestamp;
  const querystring = jsonToQueryString(params);
  const tracking = apiDomain + trackingUrl + querystring;
  
  document.getElementById("tracking").src = tracking;
  localStorage.setItem("tracking_info", JSON.stringify(trackingInfo));
}

export async function  getTrackingInfo(documentId){
  console.log("getTrackingInfo", documentId);
   
  return await ajax.get(apiDomain + trackingInfoUrl, {documentId: documentId})
}

export function getThumbnail(documentId, pageNo, documentName) {
  //let imageUrl = imgDomain+ "/document/thumb/" + documentId + "/" + pageNo;
  let imageUrl = imgDomain + "/THUMBNAIL/" + documentId + "/300X300/"  + pageNo;
  if(documentName){
    if(documentName.lastIndexOf(".dotx")>0 || documentName.lastIndexOf(".dot")>0 || documentName.lastIndexOf(".docx")>0){
      imageUrl = getPageView(documentId, 1);
    }
  }

  return imageUrl;
}

export function getDocuments(params){

  return ajax.post(apiDomain + getDocumentsUrl, params);
}

export function getCuratorDocuments(params) {
  let key = null
  if(params.nextPageKey){
    key = btoa(JSON.stringify(params.nextPageKey));
    console.log(params," base64 encoded to ", key);
  } else {
    console.log("first page");
  }  
  return ajax.post(apiDomain + getCuratorDocumentsUrl, params);
}

export function getTodayVotedDocumentsByCurator(params) {

  const data = {
    accountId: params.accountId,
  }

  return ajax.post(apiDomain + getTodayVotedDocumentsByCuratorUrl, data);
}

export function getDocument(documentId){

  const url = apiDomain + getDocumentUrl + documentId;
  return ajax.get(url, null);
}

export function getDocumentText(documentId){

  const url = apiDomain + getDocumentTextUrl + documentId;
  return ajax.get(url, {});
}

export function registDocument(args, callback) {

  console.log("registDocument", args);

  const fileInfo = args.fileInfo;
  const user = args.userInfo;
  const ethAccount = args.ethAccount;
  const tags = args.tags;
  const title = args.title;
  const desc = args.desc;

  if(!fileInfo.file){
    console.error("The registration value(file or metadata) is invalid.", fileInfo);
    return;
  }

  return new Promise(function(resolve, reject) {

    // 1. Regist Document Meta Info
    const url = apiDomain + registDocumentInfoUrl;
    console.log("Regist Document Meta Info", url, fileInfo);

    const data = {
      filename: fileInfo.file.name,
      size: fileInfo.file.size,
      nickname: user.nickname,
      username: user.name,
      accountId: user.email,
      sub: user.sub,
      ethAccount: ethAccount,
      title: title,
      desc: desc,
      tags:tags 
    }
    const promise = ajax.post(url, data).then((res) => {

        console.log("Getting Response Regist Document Meta Info", res);
        //2. Upload File Binary
        if(res && res.data && res.data.success){
          const documentId = res.data.documentId;
          const owner = res.data.accountId;
          const signedUrl = res.data.signedUrl;
          fileUpload({
              file: fileInfo.file,
              fileid : documentId,
              fileindex : 1,
              ext: fileInfo.ext,
              owner: owner,
              signedUrl: signedUrl,
              callback: callback
            }).then((res)=>{

            console.log("Upload Document Complete", res);
            resolve({documentId:documentId, accountId:owner});
          });

        } else {

            let detail = null;
            if(res && res.data){
                detail = JSON.stringify(res.data);
            }
            reject(new Error("regist document response data is invalid!"));
        }
      }).catch((err) => {
        console.error("Document Registration Error", err)
      });


  });

}

function fileUpload(params) {

  if(params.file==null || params.fileid == null || params.ext == null){
    console.error("file object is null", params);
    return;
  }
  console.log("fileUpload", params);
  const fileid = params.fileid;
  const fileindex = params.fileindex;
  const ext = params.ext;
  const owner = params.owner;
  //const url = uploadDomain + "/" + fileid + "/" + owner + "/" + ext;
  const urlSplits = params.signedUrl.split("?");

  const url = urlSplits[0];
  const search = urlSplits[1];
  const query = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })
  console.log(url, query);
  const formData = new FormData();
  formData.append('file', params.file);
  const config = {
      headers: {
          "content-type": 'application/octet-stream',
          "Signature": query.Signature,
          "x-amz-acl": "authenticated-read"
      },
      onUploadProgress: (e) => {
        console.log("onUploadProgress : " + e.loaded + "/" + e.total);
        if (e.laod !== null && params.callback !== null) {
            params.callback(e);
        }
      },

  }

  return axios.put(url, params.file, config);
}

export function sendVoteInfo(ethAccount, curatorId, voteAmount, document, transactionResult) {
  console.log("sendVoteInfo", curatorId, voteAmount);
  if(!curatorId || !document|| isNaN(voteAmount) || voteAmount<=0 || !ethAccount) {
    console.error("sendVoteInfo Parameter Invaild", params);
    return;
  }


  const url = apiDomain + voteDocumentUrl + document.documentId;
  const params = {
    curatorId: curatorId,
    voteAmount: voteAmount,
    documentId: document.documentId,
    ethAccount: ethAccount,
    transaction: transactionResult
  }

  return ajax.post(url, params);
}

export function convertTimestampToString(timestamp) {
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: "2-digit", minute: "2-digit" };
  return (new Date(timestamp)).toLocaleString("en-US", options);
}

export function getContentDownload(accountId, documentId) {

  return new Promise((resolve, reject) => {

    const url = apiDomain + getDocumentDownloadUrl + accountId + "/" + documentId;
    axios.get(url, null).then((res) => {
      console.log(res.data);
      const downloadUrl = res.data.downloadUrl;
      const filename = res.data.document.documentName;
      console.log(downloadUrl, filename);

      const config = {
        responseType: 'arraybuffer', // important
        headers: {
           'Accept':'application/pdf'
        }
      }
      ajax.get(downloadUrl, config).then((response) => {
        const blob = new Blob([response.data], {type: response.data.type});
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
      });

    }).catch((err) => {
      reject(err);
    });

  })

}
