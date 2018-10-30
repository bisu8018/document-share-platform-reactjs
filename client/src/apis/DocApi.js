import axios from 'axios';
import * as ajax from './CommonAjaxApis';
import { APP_PROPERTIES } from '../resources/app.properties';

const uploadDomain = APP_PROPERTIES.domain.upload + '/prod/upload' //"https://24gvmjxwme.execute-api.us-west-1.amazonaws.com/prod/upload";
const imgDomain = APP_PROPERTIES.domain.image;// + '/prod/document/get'//"https://24gvmjxwme.execute-api.us-west-1.amazonaws.com";
const apiDomain = APP_PROPERTIES.domain.api;//"https://iwzx8ah5xf.execute-api.us-west-1.amazonaws.com/dev";

const registDocumentInfoUrl = "/api/document/regist";
const getDocumentsUrl = "/api/document/list";
const getDocumentUrl = "/api/document/info/";
const getDocumentTextUrl = "/api/document/text/";

const voteDocumentUrl = "/api/document/vote/";

export function getPageView(documentId, pageNo) {
  return imgDomain + "/document/get/" + documentId + "/" + pageNo;
}

export function getThumbnail(documentId, pageNo) {
  return imgDomain+ "/document/thumb/" + documentId + "/" + pageNo;
}

export function getDocuments(params){


  let key = null
  if(params.nextPageKey){
    key = btoa(JSON.stringify(params.nextPageKey));
    console.log(params," base64 encoded to ", key);
  } else {
    console.log("first page");
  }

  const config = {
    header: {
       'Access-Control-Allow-Origin': '*',
       'Content-Type':'application/json'
    },
    params: {
      nextPageKey:key,
      email:params.email,
      tag: params.tag
    }
  }

  return axios.post(apiDomain + getDocumentsUrl, config);
}

export function getDocument(documentId){

  const config = {
    header: {
       'Access-Control-Allow-Origin': '*',
       'Content-Type':'application/json'
    }
  }
  const url = apiDomain + getDocumentUrl + documentId;
  return axios.get(url, config);
}

export function getDocumentText(documentId){

  const config = {
    header: {
       'Access-Control-Allow-Origin': '*',
       'Content-Type':'application/json'
    }
  }
  const url = apiDomain + getDocumentTextUrl + documentId;
  return axios.get(url, config);
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
    const url = apiDomain + registDocumentInfoUrl;//localhost:4000/document/regist"
    console.log("Regist Document Meta Info", url, fileInfo);
    const promise = ajax.post(url, {
      filename: fileInfo.file.name,
      size: fileInfo.file.size,
      nickname: user.nickname,
      username: ethAccount,
      ethAccount: ethAccount,
      title: title,
      desc: desc,
      tags:tags }).then((res) => {

        console.log("Getting Response Regist Document Meta Info", res);
        //2. Upload File Binary
        if(res && res.status == 200){
          const documentId = res.data.documentId;
          const owner = res.data.accountId;
          fileUpload({
              file: fileInfo.file,
              fileid : documentId,
              fileindex : 1,
              ext: fileInfo.ext,
              owner: owner
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
  const url = uploadDomain + "/" + fileid + "/" + owner + "/" + ext;
  console.log(url);
  const formData = new FormData();
  formData.append('file', params.file);
  const config = {
      headers: {
          'content-type': 'application/octet-stream',
          'x-api-key': 'M84xHJ4cPEa1CAcmxHgTzyfSzIQSIZEaLR1mzRod'
      }
  }

  return axios.put(url, params.file, config);
}

export function sendVoteInfo(curatorId, voteAmount, document) {
  console.log("sendVoteInfo", curatorId, voteAmount, document);
  if(!curatorId || !document || isNaN(voteAmount) || voteAmount<=0) {
    console.error("sendVoteInfo Parameter Invaild", params);
    return;
  }


  const url = apiDomain + voteDocumentUrl + document.documentId;
  const params = {
    curatorId: curatorId,
    voteAmount: voteAmount,
    documentInfo: document,
  }

  return axios.post(url, params);
}
