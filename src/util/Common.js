import { APP_PROPERTIES } from "../properties/app.properties";
import MainRepository from "../redux/MainRepository";
import { BigNumber } from "bignumber.js";

const imgDomain = APP_PROPERTIES.domain().image;
//const apiDomain = APP_PROPERTIES.domain().api;

export default ({
  // Timestamp GET
  getTimestamp: (date) => {
    // daily YYYY-MM-DD 00:00:00(실행기준에서 전날 일자)
    return Math.floor(date / (60 * 60 * 24 * 1000)) * (60 * 60 * 24 * 1000);
  },
  // change Timestamp to Datetime
  timestampToDateTime: (timestamp) => {
    let date = new Date(timestamp);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let year = date.getFullYear();
    let month = months[date.getMonth()];
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    return day + " " + month + " " + year + " " + (hour < 10 ? "0" : "") + hour + ":" + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
  },
  // change Timestamp to Date
  timestampToDate: (timestamp) => {
    let date = new Date(timestamp);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let year = date.getFullYear();
    let month = months[date.getMonth()];
    let day = date.getDate();
    return month + " " + day + ", " + year;
  },
  // change Timestamp to Time
  timestampToTime: (timestamp) => {
    let date = new Date(timestamp);
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    return (hour < 10 ? "0" : "") + hour + ":" + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
  },
  // Get Date String
  dateString: (date) => {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
      .toISOString()
      .split("T")[0];
  },
  // Get Month String
  monthToString: (month) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[month - 1];
  },
  // Get  A particular week Monday
  getMonday: (date) => {
    date = new Date(date);
    let day = date.getDay(),
      diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
  },
  // Get The number of weeks in a particular month
  getWeeksCount: (year, month) => {
    const dayThreshold = [5, 1, 5, 6, 5, 6, 5, 5, 6, 5, 6, 5];
    let firstDay = new Date(year, month, 1).getDay();
    let baseWeeks = (month === 1 ? 4 : 5);

    return baseWeeks + (firstDay >= dayThreshold[month] ? 1 : 0);
  },
  // Set Date Type
  setDateType: (year, month, date) => {
    return year + "-" + (month < 10 ? "0" : "") + month + "-" + (date < 10 ? "0" : "") + date;
  },
  // Get Date Ago on Number
  dateAgo: (timestamp) => {
    let currentDate = new Date();
    let lastDate = new Date(timestamp);
    return Math.floor((currentDate - lastDate) / (60 * 60 * 24 * 1000));
  },
  // Scroll to top
  scrollTop: () => {
    window.scrollTo(0, 0);
  },
  convertTimestampToString: (timestamp) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return (new Date(timestamp)).toLocaleString("en-US", options);
  },
  getThumbnail: (documentId, size, pageNo, documentName) => {
    let _size = size;
    if (documentName) {
      if (documentName.lastIndexOf(".dotx") > 0 || documentName.lastIndexOf(".dot") > 0 || documentName.lastIndexOf(".docx") > 0) {
        _size = "1024";
      }
    }
    return imgDomain + "/" + documentId + "/" + _size + "/" + pageNo;
  },
  getText: (documentId, pageNo, callback, error) => {
    let textUrl = imgDomain + "/THUMBNAIL/" + documentId + "/text/" + pageNo;

    fetch(textUrl).then((result) => {
      if (result.status === 404) return error(result.statusText);
      result.text().then((_result) => {
        callback(_result);
      });
    });
  },
  getPath: () => {
    const pathArr = window.location.pathname.split("/");
    return pathArr[1];
  },
  getMySub: () => {
    let authSub = "";
    let isAuthenticated = MainRepository.Account.isAuthenticated();

    if (isAuthenticated) {
      authSub = MainRepository.Account.getMyInfo().sub || "";
    }

    return authSub;
  },

  getTag: () => {
    const pathArr = window.location.pathname.split("/");
    let tag = "";
    if (pathArr.length > 2 && (pathArr[1] === "latest" || pathArr[1] === "featured" || pathArr[1] === "popular")) {
      tag = decodeURI(pathArr[2]);
    }
    return tag;
  },
  escapeRegexCharacters: str => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  },
  loginCheck: () => {
    if (!MainRepository.Account.isAuthenticated()) return MainRepository.Account.login();
  },
  getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },
  setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/;";
  },
  deleteCookie(name) {
    if (this.getCookie(name)) document.cookie = name + "=;expires=Thu, 01-Jan-70 00:00:01 GMT";
  },
  checkEmailForm: (email: string) => {
    let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    return email.match(regExp);
  },
  toDollar: (deck: string) => {
    let c = 0.001;
    let d = new BigNumber("1e+18");
    let bn = new BigNumber(deck);
    let dollar = bn.dividedBy(d).multipliedBy(c);
    //120,000,000,000,000,000,000
    return Math.round(dollar.toNumber() * 100) / 100;
  },
  toDeck: (smallDeck: string) => {
    let d = new BigNumber("1e+18");
    let bn = new BigNumber(smallDeck);
    let deck = bn.dividedBy(d);
    //120,000,000,000,000,000,000
    return Math.round(deck.toNumber() * 100) / 100;
  },
  toEther: (str: string) => {
    let d = new BigNumber("1e+18");
    let bn = new BigNumber(str);
    let ether = bn.dividedBy(d);
    return Math.round(ether.toNumber() * 100) / 100;
  },
  deckToDollar: (str: string) => {
    if (isNaN(str)) return 0;
    let c = 0.001;
    let bn = new BigNumber(str);
    let dollar = bn.multipliedBy(c);
    return Math.round(dollar.toNumber() * 100) / 100;
  },
  authorCalculateReward: (pv: number, tpv: number, pool: number) => {
    if (tpv === 0 || pv === 0 || pool === 0) return 0;
    return (pv * (pool / tpv));
  },
  curatorCalculateReward: (pool: number, v: number, tv: number, pv: number, tpvs: number) => {
    if (pool === 0 || v === 0 || tv === 0 || pv === 0 || tpvs === 0) return 0;
    return (((pool * (Math.pow(pv, 2))) / tpvs) * v / tv);
  },
  jsonToQueryString: (json) => {
    return "?" +
      Object.keys(json).map(function(key) {
        return encodeURIComponent(key) + "=" +
          encodeURIComponent(json[key]);
      }).join("&");
  },
  getAuthorNDaysReward(result: any, getCreatorDailyRewardPool: number, totalViewCountInfo: any, day: number) {
    if (!totalViewCountInfo || !result.latestPageviewList || getCreatorDailyRewardPool === 0) return;
    let y, m, d, pv, tpv, timestamp;
    let totalReward = 0;

    for (let i = 0; i < result.latestPageviewList.length; ++i) {
      y = result.latestPageviewList[i].year;
      m = result.latestPageviewList[i].month;
      d = result.latestPageviewList[i].dayOfMonth;
      pv = result.latestPageviewList[i].pv;
      timestamp = result.latestPageviewList[i].timestamp;

      for (let j = 0; j < totalViewCountInfo.length; ++j) {
        if (totalViewCountInfo[j]._id.year === y &&
          totalViewCountInfo[j]._id.month === m &&
          totalViewCountInfo[j]._id.dayOfMonth === d) {
          tpv = totalViewCountInfo[j].totalPageview;
        }
      }
      if (this.dateAgo(timestamp) <= day) totalReward += this.authorCalculateReward(pv, tpv, getCreatorDailyRewardPool);
      if (i === result.latestPageviewList.length - 1) return totalReward;
    }
  },
  getAuthorNDaysTotalReward(documentList: any, getCreatorDailyRewardPool: number, totalViewCountInfo: any, day: number) {

    if (!documentList || getCreatorDailyRewardPool <= 0 || !totalViewCountInfo) return;
    let totalReward = 0;
    for (let k = 0; k < documentList.length; ++k) {
      if (documentList[k].latestPageviewList) {
        let y, m, d, pv, tpv, timestamp;
        let reward = 0;

        for (let i = 0; i < documentList[k].latestPageviewList.length; ++i) {
          y = documentList[k].latestPageviewList[i].year;
          m = documentList[k].latestPageviewList[i].month;
          d = documentList[k].latestPageviewList[i].dayOfMonth;
          pv = documentList[k].latestPageviewList[i].pv;
          timestamp = documentList[k].latestPageviewList[i].timestamp;

          for (let j = 0; j < totalViewCountInfo.length; ++j) {
            if (totalViewCountInfo[j]._id.year === y &&
              totalViewCountInfo[j]._id.month === m &&
              totalViewCountInfo[j]._id.dayOfMonth === d) {
              tpv = totalViewCountInfo[j].totalPageview;
            }
          }
          if (this.dateAgo(timestamp) <= day) reward += this.authorCalculateReward(pv, tpv, getCreatorDailyRewardPool);
          if (i === documentList[k].latestPageviewList.length - 1) totalReward += reward;
        }
      }
      if (k === documentList.length - 1) {
        return totalReward;
      }
    }
  },
  getAuthor7DaysTotalReward(documentList: any, getCreatorDailyRewardPool: number, totalViewCountInfo: any) {
    if (!documentList || getCreatorDailyRewardPool <= 0 || !totalViewCountInfo) return;

    let totalReward = 0;

    for (let k = 0; k < documentList.length; ++k) {
      if (documentList[k].latestPageviewList) {
        let y, m, d, pv, tpv, timestamp;
        let reward = 0;

        for (let i = 0; i < documentList[k].latestPageviewList.length; ++i) {
          y = documentList[k].latestPageviewList[i].year;
          m = documentList[k].latestPageviewList[i].month;
          d = documentList[k].latestPageviewList[i].dayOfMonth;
          pv = documentList[k].latestPageviewList[i].pv;
          timestamp = documentList[k].latestPageviewList[i].timestamp;

          for (let j = 0; j < totalViewCountInfo.length; ++j) {
            if (totalViewCountInfo[j]._id.year === y &&
              totalViewCountInfo[j]._id.month === m &&
              totalViewCountInfo[j]._id.dayOfMonth === d) {
              tpv = totalViewCountInfo[j].totalPageview;
            }
          }
          if (this.dateAgo(timestamp) <= 7 && this.dateAgo(timestamp) > 0) {
            reward += this.authorCalculateReward(pv, tpv, getCreatorDailyRewardPool);
            //console.log(reward);
          }
          if (i === documentList[k].latestPageviewList.length - 1) {
            totalReward += reward;
          }
        }
      }
    }
    return totalReward;
  },
  // Curator N Days Total Reward
  getCuratorNDaysTotalReward(documentList: any, getCuratorDailyRewardPool: number, totalViewCountInfo: any, day: number, voteDocList: any) {
    if (!documentList || getCuratorDailyRewardPool <= 0 || !totalViewCountInfo || !voteDocList) return;
    let totalReward = 0;
    for (let k = 0; k < documentList.length; ++k) {
      if (!documentList[k].depositList) return;

      let y, m, d, tv, tpvs, v, timestamp;
      let reward = 0;
      let pv = documentList[k].latestPageview;
      tv = voteDocList[k].latestVoteAmount;

      for (let i = 0; i < documentList[k].depositList.length; ++i) {
        y = documentList[k].depositList[i].year;
        m = documentList[k].depositList[i].month;
        d = documentList[k].depositList[i].dayOfMonth;
        v = documentList[k].depositList[i].deposit;

        timestamp = documentList[k].depositList[i].timestamp;

        for (let j = 0; j < totalViewCountInfo.length; ++j) {
          if (totalViewCountInfo[j]._id.year === y &&
            totalViewCountInfo[j]._id.month === m &&
            totalViewCountInfo[j]._id.dayOfMonth === d) {
            tpvs = totalViewCountInfo[j].totalPageviewSquare;
          }
        }
        if (this.dateAgo(timestamp) <= day) reward += this.curatorCalculateReward(getCuratorDailyRewardPool, v, tv, pv, tpvs);
        if (i === documentList[k].depositList.length - 1) totalReward += reward;
      }
      if (k === documentList.length - 1) return totalReward;
    }
  },
  // Curator 7 Days Total Reward
  getCurator7DaysTotalReward(documentList: any, getCuratorDailyRewardPool: number, totalViewCountInfo: any, voteDocList: any) {
    if (!documentList || getCuratorDailyRewardPool <= 0 || !totalViewCountInfo || !voteDocList) return;
    let totalReward = 0;
    for (let k = 0; k < documentList.length; ++k) {
      if (!documentList[k].depositList) return;

      let y, m, d, tv, tpvs, v, timestamp;
      let reward = 0;
      let pv = documentList[k].latestPageview;
      tv = voteDocList[k].latestVoteAmount;

      for (let i = 0; i < documentList[k].depositList.length; ++i) {
        y = documentList[k].depositList[i].year;
        m = documentList[k].depositList[i].month;
        d = documentList[k].depositList[i].dayOfMonth;
        v = documentList[k].depositList[i].deposit;

        timestamp = documentList[k].depositList[i].timestamp;

        for (let j = 0; j < totalViewCountInfo.length; ++j) {
          if (totalViewCountInfo[j]._id.year === y &&
            totalViewCountInfo[j]._id.month === m &&
            totalViewCountInfo[j]._id.dayOfMonth === d) {
            tpvs = totalViewCountInfo[j].totalPageviewSquare;
          }
        }
        if (this.dateAgo(timestamp) <= 7 && this.dateAgo(timestamp) > 0) reward += this.curatorCalculateReward(getCuratorDailyRewardPool, v, tv, pv, tpvs);
        if (i === documentList[k].depositList.length - 1) totalReward += reward;
      }
      if (k === documentList.length - 1) {
        return totalReward;
      }
    }
  }
});
