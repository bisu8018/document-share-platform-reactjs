import AxiosService from "./AxiosService";

let tagListUrl = "tags";

export default {
  GET: {
    tagList: (data,callback, error) => {
      AxiosService._requestWithUrlPram( tagListUrl, "GET", data,
        (data) => {
          callback(data);
        }, (err) => {
          error(err)
        });
    },
  }
};
