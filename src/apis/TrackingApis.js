import $ from "jquery";
import shortid from 'shortid'
import ReactGA from 'react-ga';
import { APP_PROPERTIES } from 'properties/app.properties';

const apiDomain = APP_PROPERTIES.domain().api;

const trackingUrl = "/api/tracking/collect";

function initialize (opts) {
    console.log("Tracking initialize!!");
    localStorage.setItem("clientId", opts.cid);
}

function jsonToQueryString(json){
    return '?' + 
    Object.keys(json).map(function(key) {
        return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key]);
    }).join('&');
}

function makeId(){
    return shortid.generate();
}

    
function tracking(params, async, sidClear){
    const timestamp = Date.now();
    let trackingInfo = null;
    try{
        trackingInfo = JSON.parse(localStorage.getItem("tracking_info"));
    } catch(e){
        console.error(e);
    }
    
    if(!trackingInfo){
        
        trackingInfo = {
        sid: makeId(),
        touchAt: timestamp
        }
    }
    
    if(!trackingInfo.sid || timestamp - trackingInfo.touchAt > 1000 * 60 * 30 /**30 min */){
        //sid는 30분 지나면 새로 갱신함(이벤트마다 갱신됨)
        const sid = makeId();
        console.log("renew sid", sid);
        trackingInfo.sid =  sid;
    }

    ReactGA.ga((tracker) => {
        const clientId = tracker.get('clientId');
        trackingInfo.cid =  clientId;
        
    });
    //const cid = localStorage.getItem("clientId");
    
    if(!trackingInfo.cid){
        throw new Error("client id invalid on tracking");
    }
    
    
    params.sid = trackingInfo.sid; //session id
    params.cid = trackingInfo.cid; //clinet id
    params.t = timestamp; //touch time
    
    console.log("tracking params", params);
    const querystring = jsonToQueryString(params);
    const tracking = apiDomain + trackingUrl + querystring;
    
    //document.getElementById("tracking").src = tracking;
    
    $.ajax({
        type: 'GET',
        async: async,
        url: tracking
    });
    
    //const result = await ajax.get(tracking);
    //console.log(result);
    
    if(sidClear){
        trackingInfo.sid = undefined;
    }
    //touchAt 현재 시간으로 갱신 후 localStorage에 저장
    trackingInfo.touchAt = timestamp;
    localStorage.setItem("tracking_info", JSON.stringify(trackingInfo));
}
    
export default {
    initialize,
    tracking
}