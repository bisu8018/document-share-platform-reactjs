import axios from 'axios';
import * as ajax from './CommonAjaxApis';
import { APP_PROPERTIES } from '../resources/app.properties';

const uploadDomain = APP_PROPERTIES.domain.upload + '/prod/upload' //"https://24gvmjxwme.execute-api.us-west-1.amazonaws.com/prod/upload";
const imgDomain = APP_PROPERTIES.domain.image + '/prod/document/get'//"https://24gvmjxwme.execute-api.us-west-1.amazonaws.com";
const apiDomain = APP_PROPERTIES.domain.api;//"https://iwzx8ah5xf.execute-api.us-west-1.amazonaws.com/dev";

const registDocumentInfoUrl = "/document/regist";
const getDocumentsUrl = "/document/list";

export function getPageView(documentId, pageNo) {
  return imgDomain+ "/" + documentId + "/" + pageNo;
}

export function getDocuments(params){

  const config = {
    header: {
       'Access-Control-Allow-Origin': '*',
       'Content-Type':'application/json'
    }
  }

 return axios.get(apiDomain + getDocumentsUrl, config);
}

export function registDocument(args, callback) {
  const fileInfo = args.fileInfo;
  const user = args.userInfo;
  const account = args.account;
  const tags = args.tags;

  if(!fileInfo.file || !user){
    console.error("The registration value(file or metadata) is invalid.", fileInfo, user);
    return;
  }

  // 1. Regist Document Meta Info
  const url = apiDomain + registDocumentInfoUrl;//localhost:4000/document/regist"
  console.log("Regist Document Meta Info", url, fileInfo, user);
  const res = ajax.post(url, {
    filename:fileInfo.file.name,
    size:fileInfo.file.size,
    username:user.name,
    account: account,
    tags:tags
  }).then((registResult)=>{

    console.log("Getting Response Regist Document Meta Info", registResult.data);
    if(registResult && registResult.data && registResult.data.documentId){

      //2. Upload File Binary
      const documentId = registResult.data.documentId;
      const owner = registResult.data.accountId;
      const result = fileUpload({
          file: fileInfo.file,
          fileid : documentId,
          fileindex : 1,
          ext: fileInfo.ext,
          owner: owner
        }).then((uploadResult)=>{
        console.log("Upload Document Complete", res);
        return callback({documentId:documentId, accountId:owner});
      });
    } else {
        let detail = null;
        if(registResult && registResult.data){
            detail = JSON.stringify(registResult.data);
        }
        return callback(null, {err:"error", message:"regist document response data is invalid!", "detail":detail});
    }
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
  return axios.put(url, params.file, config).then((res) => {
    console.log("fileUpload Complete", res);
    return res;
  })
}
