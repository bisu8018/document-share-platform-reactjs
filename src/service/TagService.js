import AxiosService from "./AxiosService";

let tagListUrl = "tags";

export default {
  GET: {
    tagList: (data) => {
      return new Promise((resolve, reject) => {
        AxiosService._requestWithUrlPram(tagListUrl, "GET", data,
          (data) => {
            resolve(data);
          }, (err) => {
            reject(err);
          });
      });
    }
  }
};
