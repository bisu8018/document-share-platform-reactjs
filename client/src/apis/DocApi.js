import axios from 'axios';
import * as ajax from './CommonAjaxApis';
import { APP_PROPERTIES } from '../resources/app.properties';

const uploadDomain = APP_PROPERTIES.domain.upload + '/prod/upload' //"https://24gvmjxwme.execute-api.us-west-1.amazonaws.com/prod/upload";
const imgDomain = APP_PROPERTIES.domain.image;// + '/prod/document/get'//"https://24gvmjxwme.execute-api.us-west-1.amazonaws.com";
const apiDomain = APP_PROPERTIES.domain.api;//"https://iwzx8ah5xf.execute-api.us-west-1.amazonaws.com/dev";

const registDocumentInfoUrl = "/api/document/regist";
const getDocumentsUrl = "/api/document/list";
const getCuratorDocumentsUrl = "/api/curator/document/list";
const getTodayVotedDocumentsByCuratorUrl = "/api/curator/document/today";
const getDocumentUrl = "/api/document/info/";
const getDocumentTextUrl = "/api/document/text/";
const getDocumentDownloadUrl = "/api/document/download/";
const voteDocumentUrl = "/api/document/vote/";

export function getPageView(documentId, pageNo) {
  //return imgDomain + "/document/get/" + documentId + "/" + pageNo;
  //http://dev-ca-document.s3-website-us-west-1.amazonaws.com/THUMBNAIL/002107e7ce7541fdafa256f50babafff/300X300/1
  return imgDomain + "/THUMBNAIL/" + documentId + "/1200X1200/"  + pageNo;
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
      tag: params.tag,
      path: params.path
    }
  }

  return axios.post(apiDomain + getDocumentsUrl, config);
}

export function getCuratorDocuments(params) {
  let key = null
  if(params.nextPageKey){
    key = btoa(JSON.stringify(params.nextPageKey));
    console.log(params," base64 encoded to ", key);
  } else {
    console.log("first page");
  }

  const config = {
    headers: {
       'Access-Control-Allow-Origin': '*',
       'Content-Type':'application/json'
    },
    params: {
      nextPageKey:key,
      accountId:params.accountId,
      tag: params.tag
    }
  }

  return axios.post(apiDomain + getCuratorDocumentsUrl, config);
}

export function getTodayVotedDocumentsByCurator(params) {

  const config = {
    header: {
       'Access-Control-Allow-Origin': '*',
       'Content-Type':'application/json'
    },
    params: {
      accountId: params.accountId,
    }
  }

  return axios.post(apiDomain + getTodayVotedDocumentsByCuratorUrl, config);
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
  console.log("sendVoteInfo", curatorId, voteAmount, document);
  if(!curatorId || !document || isNaN(voteAmount) || voteAmount<=0 || !ethAccount) {
    console.error("sendVoteInfo Parameter Invaild", params);
    return;
  }


  const url = apiDomain + voteDocumentUrl + document.documentId;
  const params = {
    curatorId: curatorId,
    voteAmount: voteAmount,
    documentId: document.documentId,
    documentInfo: document,
    ethAccount: ethAccount,
    transaction: transactionResult
  }

  return axios.post(url, params);
}

export function convertTimestampToString(timestamp) {
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: "2-digit", minute: "2-digit" };
  return (new Date(timestamp)).toLocaleString("en-US", options);
}

export function getContentDownload(accountId, documentId) {

  return new Promise((resolve, reject) => {

    const config = {
      header: {
         'Access-Control-Allow-Origin': '*',
         'Content-Type':'application/json'
      }
    }
    const url = apiDomain + getDocumentDownloadUrl + accountId + "/" + documentId;
    axios.get(url, config).then((res) => {
      console.log(res.data);
      const downloadUrl = res.data.downloadUrl;
      const filename = res.data.document.documentName;
      console.log(downloadUrl, filename);

      const config = {
        responseType: 'arraybuffer', // important
        headers: {
           'Access-Control-Allow-Origin': '*',
           'Access-Control-Allow-Credentials': true,
           'Accept':'application/pdf'
        }
      }
      axios.get(downloadUrl, config).then((response) => {
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
