import { APP_PROPERTIES } from "../properties/app.properties";
import MainRepository from "../redux/MainRepository";
import BigNumber from "bignumber.js/bignumber";
import { psString } from "./localization";

const imgDomain = APP_PROPERTIES.domain().image;
const env = APP_PROPERTIES.env;

export default ({
  // Timestamp GET
  getTimestamp: (date) => {
    // daily YYYY-MM-DD 00:00:00(실행기준에서 전날 일자)
    return Math.floor(date / (60 * 60 * 24 * 1000)) * (60 * 60 * 24 * 1000);
  },
  // change timestamp to duration
  timestampToDuration: (timestamp) => {
    let date = new Date(timestamp);

    let h = date.getHours() - 9;
    h = h > 0 ? (h + " hour" + (h === 1 ? "" : "s")) + "  " : "";

    let m = date.getMinutes();
    m = m > 0 ? (m + " min" + (m === 1 ? "" : "s")) + "  " : "";

    let s = date.getSeconds();
    s = s > 0 ? (s + " sec" + (s === 1 ? "" : "s")) + "  " : "";

    if (h === "" && m === "" && s === "") return "";
    else return "Duration: " + h + m + s;
  },
  // change timestamp to duration
  timestampToDurationJustTime: (timestamp) => {
    let date = new Date(timestamp);

    let h = date.getHours() - 9;
    h = h > 0 ? (h + "h ") : "";

    let m = date.getMinutes();
    m = m > 0 ? (m + "m ") : "";

    let s = date.getSeconds();
    s = s > 0 ? (s + "s ") : "";

    if (h === "" && m === "" && s === "") return "0s ";
    else return h + m + s;
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
  // change Timestamp to Time
  timestampToTimeNotGmt: (timestamp) => {
    let date = new Date(timestamp);
    let hour = date.getHours() - 9;
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
  // Get Date Time Ago on Number
  dateTimeAgo: (timestamp, isMobile) => {
    let currentDate = new Date();
    let lastDate = new Date(timestamp);
    let y = Math.floor((currentDate - lastDate) / (60 * 60 * 24 * 365 * 1000));
    let d = Math.floor((currentDate - lastDate) / (60 * 60 * 24 * 1000));
    let h = Math.floor((currentDate - lastDate) / (60 * 60 * 1000));
    let m = Math.floor((currentDate - lastDate) / (60 * 1000));
    let s = Math.floor((currentDate - lastDate) / (1000));

    if (y !== 0) return y + (isMobile ? "y" : psString("common-year")) + (y > 1 && !isMobile ? psString("common-times") : "") + psString("common-ago");
    else {
      if (d !== 0) return d + (isMobile ? "d" : psString("common-day")) + (d > 1 && !isMobile ? psString("common-times") : "") + psString("common-ago");
      else {
        if (h !== 0) return h + (isMobile ? "h" : psString("common-hour")) + (h > 1 && !isMobile ? psString("common-times") : "") + psString("common-ago");
        else {
          if (m !== 0) return m + (isMobile ? "m" : psString("common-minute")) + (m > 1 && !isMobile ? psString("common-times") : "") + psString("common-ago");
          else {
            return s + (isMobile ? "s" : psString("common-second")) + (s > 1 && !isMobile ? psString("common-times") : "") + psString("common-ago");
          }
        }
      }
    }
  },
  // Scroll to top
  scrollTop: () => {
    window.scrollTo(0, 0);
  },
  // Set BODY TAG Style
  setBodyStyleLock: () => {
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "5px";
    return true;
  },
  // Set BODY TAG Style
  setBodyStyleUnlock: () => {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    return true;
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
  escapeRegexCharacters: str => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  },
  loginCheck: () => {
    if (!MainRepository.Account.isAuthenticated()) return MainRepository.Account.login();
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
  checkUsernameForm: (name: string) => {
    let regExp = /^[a-z0-9+]*$/;

    return name.match(regExp);
  },
  toDollar: (deck: string) => {
    if (isNaN(deck) || !deck) return 0;
    let c = 0.005;
    let d = new BigNumber("1e+18");
    let bn = new BigNumber(deck);
    let dollar = bn.dividedBy(d).multipliedBy(c);
    //120,000,000,000,000,000,000
    return (Math.round(dollar.toNumber() * 100) / 100);
  },
  toDeck: (smallDeck: string) => {
    if (isNaN(smallDeck) || !smallDeck) return 0;
    let d = new BigNumber("1e+18");
    let bn = new BigNumber(smallDeck);
    let deck = bn.dividedBy(d);
    //120,000,000,000,000,000,000
    return Math.round(deck.toNumber() * 100) / 100;
  },
  toEther: (str: string) => {
    if (isNaN(str) || !str) return 0;
    let d = new BigNumber("1e+18");
    let bn = new BigNumber(str);
    let ether = bn.dividedBy(d);
    return Math.round(ether.toNumber() * 100) / 100;
  },
  deckToDollar: (str: string) => {
    if (isNaN(str) || !str) return 0;
    let c = 0.005;
    let bn = new BigNumber(str);
    let dollar = bn.multipliedBy(c);
    return (Math.round(dollar.toNumber() * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  deckStr: (deck: number) => {
    let deck1m = Math.round((deck) / 1000000) > 0 ? Math.floor((deck) / 100000) / 10 : 0;
    let deck1k = Math.round((deck) / 1000) > 0 ? Math.floor((deck) / 100) / 10 : 0;
    let deckStr = 0;

    if (deck) {
      deckStr = deck1m > 0 ? deck1m.toFixed(1) + "m" : deck1k > 0 ? deck1k + "k" : deck + "";
    }

    return deckStr;
  },
  authorCalculateReward: (pv: number, tpv: number, pool: number) => {
    if (tpv === 0 || pv === 0 || pool === 0 || !tpv || !pv || !pool) return 0;
    return (pv * (pool / tpv));
  },
  curatorCalculateReward: (pool: number, v: number, tv: number, pv: number, tpvs: number) => {
    if (pool === 0 || v === 0 || tv === 0 || pv === 0 || tpvs === 0 || !pool || !v || !tv || !pv || !tpvs) return 0;
    return (pool * (Math.pow(pv, 2) / tpvs)) * (v / tv);
  },
  jsonToQueryString: (json) => {
    return "?" +
      Object.keys(json).map(function(key) {
        return encodeURIComponent(key) + "=" +
          encodeURIComponent(json[key]);
      }).join("&");
  },
  shuffleArray: (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
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
  getVersion: () => {
    return "v " + process.env.PROJECT_VERSION;
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
  // Creator N Days Total Reward
  getAuthorNDaysTotalReward(documentList: any, getCreatorDailyRewardPool: number, totalViewCountInfo: any, day: number) {
    if (!documentList || getCreatorDailyRewardPool <= 0 || !totalViewCountInfo) return;
    let totalReward = 0;

    for (let k = 0; k < documentList.length; ++k) {
      let dk = documentList[k];
      if (dk.latestPageviewList) {
        let y, m, d, pv, tpv, timestamp;
        let reward = 0;

        for (let i = 0; i < dk.latestPageviewList.length; ++i) {
          let di = dk.latestPageviewList[i];
          y = di.year;
          m = di.month;
          d = di.dayOfMonth;
          pv = di.pv;
          timestamp = di.timestamp;

          for (let j = 0; j < totalViewCountInfo.length; ++j) {
            let tj = totalViewCountInfo[j];
            if (tj._id.year === y &&
              tj._id.month === m &&
              tj._id.dayOfMonth === d) {
              tpv = tj.totalPageview;
            }
          }
          if (this.dateAgo(timestamp) <= day) reward += this.authorCalculateReward(pv, tpv, getCreatorDailyRewardPool);
        }
        totalReward += reward;
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
      let dk = documentList[k];
      if (dk.latestPageviewList) {
        let y, m, d, pv, tpv, timestamp;
        let reward = 0;

        for (let i = 0; i < dk.latestPageviewList.length; ++i) {
          let di = dk.latestPageviewList[i];
          y = di.year;
          m = di.month;
          d = di.dayOfMonth;
          pv = di.pv;
          timestamp = di.timestamp;

          for (let j = 0; j < totalViewCountInfo.length; ++j) {
            let tj = totalViewCountInfo[j];
            if (tj._id.year === y &&
              tj._id.month === m &&
              tj._id.dayOfMonth === d) {
              tpv = tj.totalPageview;
            }
          }
          if (this.dateAgo(timestamp) <= 7 && this.dateAgo(timestamp) > 0) {
            reward += this.authorCalculateReward(pv, tpv, getCreatorDailyRewardPool);
          }
        }
        totalReward += reward;
      }
    }
    return totalReward;
  },


  // Curator N Days Total Reward
  getCuratorNDaysTotalReward(documentList: any, getCuratorDailyRewardPool: number, totalViewCountInfo: any, day: number, latestRewardVoteList: any, test) {
    if (!documentList || getCuratorDailyRewardPool <= 0 || !totalViewCountInfo || !latestRewardVoteList) return;
    let totalReward = 0;


    if (env === "local") {
      console.log("%cEstimated earnings for today", "color:blue;font-weight:bold;font-size:22px");
      console.log("Document List", documentList);
      console.log("Total View Count Info", totalViewCountInfo);
      console.log("%cTotal Docs : " + documentList.length, "color:red;font-weight:bold;");
      console.log("%cPool : " + getCuratorDailyRewardPool + "\n", "color:red;font-weight:bold;");
      console.log("%c공식 : (리워드풀 × (페이지뷰 ÷ 페이지뷰 스퀘어)) × (투표수 ÷ 총 투표수)\n", "font-size:11px;color:grey");
    }

    for (let k = 0; k < documentList.length; ++k) {
      const dk = documentList[k];

      if (dk.depositList && dk.latestPageviewList) {
        let y, m, d, tpvs, v, timestamp, reward = 0, tv = 0, pv = 0;

        for (let i = 0; i < latestRewardVoteList.length; ++i) {
          if (dk._id === latestRewardVoteList[i]._id) {
            for (let j = 0; j < latestRewardVoteList[i].latestDepositDailyList.length; ++j) {
              tv += latestRewardVoteList[i].latestDepositDailyList[j].deposit || 0;
            }
          }
        }

        if (env === "local") {
          console.log("\n\n");
          console.log("%c[" + dk.title + "]", "font-weight:bold;font-size:16px");
          console.log("Vote counts : " + dk.depositList.length);
          console.log("TV : " + tv);
          console.log("\n");
        }

        for (let i = 0; i < dk.depositList.length; ++i) {
          const di = dk.depositList[i];
          y = di.year;
          m = di.month;
          d = di.dayOfMonth;
          v = di.deposit;
          timestamp = di.created;

          for (let j = 0; j < dk.latestPageviewList.length; ++j) {
            const dj = dk.latestPageviewList[j];
            if (dj.year === y && dj.month === m && dj.dayOfMonth === d) pv += dj.pv;
          }

          for (let j = 0; j < totalViewCountInfo.length; ++j) {
            const tj = totalViewCountInfo[j];

            if (tj._id.year === y && tj._id.month === m && tj._id.dayOfMonth === d) {
              tpvs = tj.totalPageviewSquare;
              break;
            } else tpvs = 0;
          }

          if (this.dateAgo(timestamp) <= day) reward += this.curatorCalculateReward(getCuratorDailyRewardPool, v, tv, pv, tpvs);

          if (env === "local") {
            console.log("%cNo." + Number(i + 1), "font-weight:bold");
            console.log("PV : " + pv);
            console.log("TPVS : " + tpvs);
            console.log("%c(" + getCuratorDailyRewardPool + " × (" + Math.pow(pv, 2) + " ÷ " + tpvs + ")) × (" + v + " ÷ " + tv + ")", "font-weight:bold");
            console.log("%cREWARD : $" + this.deckToDollar(this.toDeck(reward)), "color:red");
            console.log("\n");
          }
        }
        totalReward += reward;
      }
    }

    if (env === "local") {
      console.log("\n\n");
      console.log("%cTOTAL REWARD : $" + this.deckToDollar(this.toDeck(totalReward)), "font-weight:bold;font-size:17px;color:purple");
      console.log("\n\n\n\n\n\n\n\n");
    }

    return totalReward;
  },


  // Curator 7 Days Total Reward
  getCurator7DaysTotalReward(documentList: any, getCuratorDailyRewardPool: number, totalViewCountInfo: any, latestRewardVoteList: any) {
    if (!documentList || getCuratorDailyRewardPool <= 0 || !totalViewCountInfo || !latestRewardVoteList) return;
    let totalReward = 0;

    if (env === "local") {
      console.log("%cRevenue for the last 7 days", "color:blue;font-weight:bold;font-size:22px");
      console.log("Document List", documentList);
      console.log("Total View Count Info", totalViewCountInfo);
      console.log("%cTotal Docs : " + documentList.length, "color:red;font-weight:bold;");
      console.log("%cPool : " + getCuratorDailyRewardPool + "\n", "color:red;font-weight:bold;");
      console.log("%c공식 : (리워드풀 × (페이지뷰 ÷ 페이지뷰 스퀘어)) × (투표수 ÷ 총 투표수)\n", "font-size:11px;color:grey");
    }

    for (let k = 0; k < documentList.length; ++k) {
      const dk = documentList[k];

      if (dk.depositList && dk.latestPageviewList) {
        let y, m, d, tpvs, v, timestamp, reward = 0, tv = 0, pv = 0;

        for (let i = 0; i < latestRewardVoteList.length; ++i) {
          if (dk._id === latestRewardVoteList[i]._id) {
            for (let j = 0; j < latestRewardVoteList[i].latestDepositDailyList.length; ++j) {
              tv += latestRewardVoteList[i].latestDepositDailyList[j].deposit || 0;
            }
          }
        }

        if (env === "local") {
          console.log("\n\n");
          console.log("%c[" + dk.title + "]", "font-weight:bold;font-size:16px");
          console.log("Vote counts : " + dk.depositList.length);
          console.log("TV : " + tv);
          console.log("\n");
        }

        for (let i = 0; i < dk.depositList.length; ++i) {
          const di = dk.depositList[i];
          y = di.year;
          m = di.month;
          d = di.dayOfMonth;
          timestamp = di.created;
          v = dk.deposit;

          for (let j = 0; j < dk.latestPageviewList.length; ++j) {
            const dj = dk.latestPageviewList[j];
            if (dj.year === y && dj.month === m && dj.dayOfMonth === d) pv += dj.pv;
          }

          for (let j = 0; j < totalViewCountInfo.length; ++j) {
            const tj = totalViewCountInfo[j];
            if (tj._id.year === y && tj._id.month === m && tj._id.dayOfMonth === d) tpvs = tj.totalPageviewSquare;
          }

          if (this.dateAgo(timestamp) <= 7 && this.dateAgo(timestamp) > 0) reward += this.curatorCalculateReward(getCuratorDailyRewardPool, v, tv, pv, tpvs);

          if (env === "local") {
            console.log("%cNo." + Number(i + 1), "font-weight:bold");
            console.log("PV : " + pv);
            console.log("TPVS : " + tpvs);
            console.log("%c(" + getCuratorDailyRewardPool + " × (" + Math.pow(pv, 2) + " ÷ " + tpvs + ")) × (" + v + " ÷ " + tv + ")", "font-weight:bold");
            console.log("%cREWARD : $" + this.deckToDollar(this.toDeck(reward)), "color:red");
            console.log("\n");
          }
        }
        totalReward += reward;
      }
    }

    if (env === "local") {
      console.log("\n\n");
      console.log("%cTOTAL REWARD : $" + this.deckToDollar(this.toDeck(totalReward)), "font-weight:bold;font-size:17px;color:purple");
      console.log("\n\n\n\n\n\n\n\n");
    }

    return totalReward;
  }
});
