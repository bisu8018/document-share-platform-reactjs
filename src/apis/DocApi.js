import axios from 'axios';
import * as axiosCustom from '../service/AxiosCustomService';
import { APP_PROPERTIES } from 'properties/app.properties';
import DocService from "../service/document/DocService";

const imgDomain = APP_PROPERTIES.domain().image;
const apiDomain = APP_PROPERTIES.domain().api;

const getDocumentDownloadUrl = "/api/document/download/";

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

    console.log("Regist Document Meta Info", fileInfo);

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
    };
    const promise = DocService.POST.promise(data,(res) => {
      console.log("Getting Response Regist Document Meta Info", res);
      //2. Upload File Binary
      if(res &&  res.success){
        const documentId = res.documentId;
        const owner = res.accountId;
        const signedUrl = res.signedUrl;
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
        if(res){
          detail = JSON.stringify(res);
        }
        reject(new Error("regist document response data is invalid!"));
      }
    }, (err) => {
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
  };
  return axios.put(url, params.file, config);
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
      };

      axiosCustom.get(downloadUrl, config).then((response) => {
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
