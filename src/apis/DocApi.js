import axios from 'axios';
import * as axiosCustom from '../service/AxiosCustomService';
import { APP_PROPERTIES } from 'properties/app.properties';

//const imgDomain = APP_PROPERTIES.domain().image;
const apiDomain = APP_PROPERTIES.domain().api;

const getDocumentDownloadUrl = "/api/document/download/";

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
