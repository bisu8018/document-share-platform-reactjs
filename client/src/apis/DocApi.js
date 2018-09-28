import axios from 'axios';
const uploadDomain = "https://24gvmjxwme.execute-api.us-west-1.amazonaws.com/prod/upload";
const apiDomain = "http://localhost:4000";

const registDocumentInfoUrl = "/document/regist";

const getDocumentsUrl = "/document/list";

export function getDocuments(nextKey){
 return axios.get(apiDomain + getDocumentsUrl);
}
/*
export function registDocument(file){
  const header = null;
  return post(apiDomain + regsitDocumentInfoUrl, params);
}
*/

export function registDocument(file, callback) {

  if(file.data == null){
    console.error("선택된 파일이 없습니다.")
    return;
  }

  // 1. Regist Document Meta Info
  const url = apiDomain + registDocumentInfoUrl;//localhost:4000/document/regist"
  console.log("Regist Document Meta Info", url, file);
  const res = post(url, null).then((res)=>{

    console.log("Regist Document Meta Info Complete", res.data);

    //2. Upload File Binary
    const fileid = res.data.documentId;
    const owner = res.data.accountId;

    const uploadParameter = {
      file: file.data,
      fileid : fileid,
      fileindex : 1,
      ext: file.ext,
      owner: owner
    }
    console.log("Upload Document", uploadParameter);

    const result = fileUpload(uploadParameter).then((res)=>{
      console.log("Upload Document Complete", res);
      if(callback!=null) callback(res);
    });

  });

}

function fileUpload(params) {
  if(params.file==null || params.fileid == null || params.ext == null){
    console.error("file object is null", params);
    return;
  }
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

export function post(url, params){

  const config = {
    method : "post",
    url : url,
    data:params,
    header: {
      "Content-Type":"application/json"
    }
  }
  return axios.post(url, config);
}

export function syncPost(url, params) {
  const config = {
    method : "post",
    url : url,
    data: params,
    header: {
      "Content-Type":"application/json"
    }
  }

  axios.post(url, config).then((res) => {
    console.log("syncPost Complete!!: ", res);
    return res;
  });
}
