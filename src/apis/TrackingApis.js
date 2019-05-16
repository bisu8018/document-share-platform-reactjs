import $ from "jquery";
import shortid from "shortid";
import ReactGA from "react-ga";
import { APP_PROPERTIES } from "properties/app.properties";
import Common from "../util/Common";

let apiDomain = APP_PROPERTIES.domain().api;
let trackingUrl = "/api/tracking/collect";

function makeId() {
  return shortid.generate();
}

function setTrackingInfo() {
  let timestamp = Date.now();
  let trackingInfo = null;

  try {
    trackingInfo = JSON.parse(localStorage.getItem("tracking_info"));
  } catch (e) {
    console.error(e);
  }

  if (!trackingInfo) {
    trackingInfo = {
      sid: makeId(),
      touchAt: timestamp
    };
  }

  if (!trackingInfo.sid || timestamp - trackingInfo.touchAt > 1000 * 60 * 30 /**30 min */) {
    //sid는 30분 지나면 새로 갱신함(이벤트마다 갱신됨)
    trackingInfo.sid = makeId();
  }

  ReactGA.ga((tracker) => {
    trackingInfo.cid = tracker.get("clientId");
  });

  if (!trackingInfo.cid) {
    console.log("client id invalid on tracking");
  }
  localStorage.setItem("tracking_info", JSON.stringify(trackingInfo));
  return trackingInfo;
}

function tracking(params, async, sidClear) {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== "production") return false;

    let timestamp = Date.now();
    let trackingInfo = this.setTrackingInfo();
    params.sid = trackingInfo.sid; //session id
    params.cid = trackingInfo.cid; //clinet id
    params.t = timestamp; //touch time

    let querystring = Common.jsonToQueryString(params);
    let tracking = apiDomain + trackingUrl + querystring;

    $.ajax({
      type: "GET",
      async: async,
      url: tracking
    }).then(res => {
      if (sidClear) {
        trackingInfo.sid = undefined;
      }
      //touchAt 현재 시간으로 갱신 후 localStorage에 저장
      trackingInfo.touchAt = timestamp;
      localStorage.setItem("tracking_info", JSON.stringify(trackingInfo));
      resolve(res);
    });
  });
}

export default { tracking, setTrackingInfo };