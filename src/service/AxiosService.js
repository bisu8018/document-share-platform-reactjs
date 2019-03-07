import axios from "axios";
import { APP_PROPERTIES } from "../properties/app.properties";
import * as qs from "qs";

export default {
  getRootUrl: function() {
    /*  if (window.location.hostname == 'localhost') {
        return window.location.protocol + '//' + 'localhost' + ':' + '8080' //window.location.port
      } else {
        return window.location.protocol + '//' + window.location.hostname
      }*/
    const apiDomain = APP_PROPERTIES.domain().api;
    return apiDomain;
  },
  getRootUrlWithApi: function() {
    return this.getRootUrl() + "/api/";
  },
  /**
   * @return {boolean}
   */
  DEBUG: function() {
    return false;
  },
  _request: function(url, type, data, success, failure, header) {
    if (this.DEBUG()) {
      console.log("[request]\nurl: " + url + "\ndata: " + data);
    }

    let _header = {"Content-Type": "application/json"};
    if(header){
      _header = Object.assign(header,_header);
    }

    axios({
      method: type,
      url: this.getRootUrlWithApi() + url,
      data: data,
      headers: _header
    })
      .then((response) => {
        if (this.DEBUG()) {
          console.log("성공\nurl: " + url + "\nres:\n" + JSON.stringify(response.data));
        }
        if (response.data.success) {
          success(response.data);
        } else {
          failure(response.data.message);
        }
      })
      .catch((error) => {
        if (error.response) {
          let status = error.response.status;
          let headers = error.response.headers;
          let data = error.response.data;
          let statusText = error.response.statusText;

          if (this.DEBUG()) {
            console.log(headers);
            console.log(data);
            console.log(status);
            console.log(statusText);
            console.log("Error!\ncode:" + status + "\nmessage:" + statusText + "\nerror:" + error);
          }
          console.log("Status: " + status);

        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error);
        }

        console.log(error);

      }).then(() => {});
  },
  _requestWithUrlPram: function(url, type, data, success, failure) {
    data = data || {};
    let params = data?"?" + qs.stringify(data) : "" ;
    this._request(
      url + params,
      type,
      "",
      success,
      failure
    );
  },
  _requestWithBody: function (url, type, data, success, failure) {
    data = data || {};

    this._request(
      url,
      type,
      JSON.stringify(data),
      success,
      failure
    )
  },
  _requestWithHeader: function (url, type, data, success, failure) {
    const _header = data.header || {};
    const _params = data.params || {};

    this._request(
      url ,
      type,
      _params,
      success,
      failure,
      _header
    )
  },
};