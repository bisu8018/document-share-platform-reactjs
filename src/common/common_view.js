import { APP_PROPERTIES } from "../properties/app.properties";
import MainRepository from "../redux/MainRepository";
import { psString } from "../config/localization";
import common from "./common";

export default ({

  // Get Date Time Ago on Number
  dateTimeAgo: (timestamp, isMobile) => {
    if(APP_PROPERTIES.ssr) return 0;

    let currentDate = new Date();
    let lastDate = new Date(timestamp);
    let y = Math.floor((currentDate - lastDate) / (60 * 60 * 24 * 365 * 1000));
    let d = Math.floor((currentDate - lastDate) / (60 * 60 * 24 * 1000));
    let h = Math.floor((currentDate - lastDate) / (60 * 60 * 1000));
    let m = Math.floor((currentDate - lastDate) / (60 * 1000));
    let s = Math.floor((currentDate - lastDate) / (1000));

    if (y > 0) return y + (isMobile ? "y" : psString("common-year")) + (y > 1 && !isMobile ? psString("common-times") : "") + psString("common-ago");
    else {
      if (d > 0) return d + (isMobile ? "d" : psString("common-day")) + (d > 1 && !isMobile ? psString("common-times") : "") + psString("common-ago");
      else {
        if (h > 0) return h + (isMobile ? "h" : psString("common-hour")) + (h > 1 && !isMobile ? psString("common-times") : "") + psString("common-ago");
        else {
          if (m > 0) return m + (isMobile ? "m" : psString("common-minute")) + (m > 1 && !isMobile ? psString("common-times") : "") + psString("common-ago");
          else {
            if (s > 0) return s + (isMobile ? "s" : psString("common-second")) + (s > 1 && !isMobile ? psString("common-times") : "") + psString("common-ago");
            else return "now";
          }
        }
      }
    }
  },

  setCookie(cname, cvalue, exdays) {
    if(APP_PROPERTIES.ssr) return false;

    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/;";
  },

  getCookie(cname) {
    if(APP_PROPERTIES.ssr) return false;

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

  deleteCookie(name) {
    if(APP_PROPERTIES.ssr) return false;

    if (this.getCookie(name)) document.cookie = name + "=;expires=Thu, 01-Jan-70 00:00:01 GMT";
  },

  getPath: () => {
    if(APP_PROPERTIES.ssr) return "";

    const pathArr = window.location.pathname.split("/");
    return decodeURI(pathArr[1]);
  },

  getPaths: () => {
    if(APP_PROPERTIES.ssr) return false;

    return window.location.pathname.split("/");
  },

  getTag: () => {
    if(APP_PROPERTIES.ssr) return "";

    const pathArr = window.location.pathname.split("/");
    let tag = "";
    if (pathArr.length > 2 && (pathArr[1] === "latest" || pathArr[1] === "featured" || pathArr[1] === "popular")) {
      tag = decodeURI(pathArr[2]);
    }
    return tag;
  },

  // Clip board copy
  clipboardCopy: id => {
    if(APP_PROPERTIES.ssr) return false;

    return new Promise((resolve, reject) => {
      document.getElementById(id).select();
      document.execCommand("copy");
      resolve();
    });
  },

  // Scroll to top
  scrollTop: () => {
    if(APP_PROPERTIES.ssr) return false;

    return window.scrollTo(0, 0)
  },

  // Set BODY TAG Style
  setBodyStyleLock: () => {
    if(APP_PROPERTIES.ssr) return false;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "5px";
    return Promise.resolve(true);
  },

  // Set BODY TAG Style
  setBodyStyleUnlock: () => {
    if(APP_PROPERTIES.ssr) return false;

    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    return Promise.resolve(true);
  },

  getMySub: () => {
    if(APP_PROPERTIES.ssr) return "";

    let authSub = "";
    let isAuthenticated = MainRepository.Account.isAuthenticated();

    if (isAuthenticated) {
      authSub = MainRepository.Account.getMyInfo().sub || "";
    }

    return authSub;
  },

  // 페이지 GET
  getPageNum: () => {
    if(APP_PROPERTIES.ssr) return 1;

    let pathName = window.location.pathname.split("/")[3],
    pageNum = pathName ? Number(pathName.split("-")[0]) : 0;
    return pageNum > 0 ? pageNum - 1 : 0;
  },

  authorCalculateReward: (pv: number, tpv: number, pool: number) => {
    if(APP_PROPERTIES.ssr) return 0;

    if (tpv === 0 || pv === 0 || pool === 0 || !tpv || !pv || !pool) return 0;
    return (pv * (pool / tpv));
  },

  curatorCalculateReward: (pool: number, v: number, tv: number, pv: number, tpvs: number) => {
    if(APP_PROPERTIES.ssr) return 0;

    if (pool === 0 || v === 0 || tv === 0 || pv === 0 || tpvs === 0 || !pool || !v || !tv || !pv || !tpvs) return 0;
    return (pool * (Math.pow(pv, 2) / tpvs)) * (v / tv);
  },

  getAuthorNDaysReward(result: any, getCreatorDailyRewardPool: number, totalViewCountInfo: any, day: number) {
    if (APP_PROPERTIES.ssr || !totalViewCountInfo || !result.latestPageviewList || getCreatorDailyRewardPool === 0) return;
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
      if (common.dateAgo(timestamp) <= day) totalReward += this.authorCalculateReward(pv, tpv, getCreatorDailyRewardPool);
      if (i === result.latestPageviewList.length - 1) return totalReward;
    }
  },

  // Creator N Days Total Reward
  getAuthorNDaysTotalReward(documentList: any, getCreatorDailyRewardPool: number, totalViewCountInfo: any, day: number) {
    if (APP_PROPERTIES.ssr || !documentList || getCreatorDailyRewardPool <= 0 || !totalViewCountInfo) return;
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
          if (common.dateAgo(timestamp) <= day) reward += this.authorCalculateReward(pv, tpv, getCreatorDailyRewardPool);
        }
        totalReward += reward;
      }
      if (k === documentList.length - 1) {
        return totalReward;
      }
    }
  },

  getAuthor7DaysTotalReward(documentList: any, getCreatorDailyRewardPool: number, totalViewCountInfo: any) {
    if (APP_PROPERTIES.ssr || !documentList || getCreatorDailyRewardPool <= 0 || !totalViewCountInfo) return;

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
          if (common.dateAgo(timestamp) <= 7 && common.dateAgo(timestamp) > 0) {
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
    if (APP_PROPERTIES.ssr || !documentList || getCuratorDailyRewardPool <= 0 || !totalViewCountInfo || !latestRewardVoteList) return;
    let totalReward = 0;


    if (APP_PROPERTIES.debug) {
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

        if (APP_PROPERTIES.debug) {
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

          if (common.dateAgo(timestamp) <= day) reward += this.curatorCalculateReward(getCuratorDailyRewardPool, v, tv, pv, tpvs);

          if (APP_PROPERTIES.debug) {
            console.log("%cNo." + Number(i + 1), "font-weight:bold");
            console.log("PV : " + pv);
            console.log("TPVS : " + tpvs);
            console.log("%c(" + getCuratorDailyRewardPool + " × (" + Math.pow(pv, 2) + " ÷ " + tpvs + ")) × (" + v + " ÷ " + tv + ")", "font-weight:bold");
            console.log("%cREWARD : $" + common.deckToDollar(common.toDeck(reward)), "color:red");
            console.log("\n");
          }
        }
        totalReward += reward;
      }
    }

    if (APP_PROPERTIES.debug) {
      console.log("\n\n");
      console.log("%cTOTAL REWARD : $" + common.deckToDollar(common.toDeck(totalReward)), "font-weight:bold;font-size:17px;color:purple");
      console.log("\n\n\n\n\n\n\n\n");
    }

    return totalReward;
  },

  // Curator 7 Days Total Reward
  getCurator7DaysTotalReward(documentList: any, getCuratorDailyRewardPool: number, totalViewCountInfo: any, latestRewardVoteList: any) {
    if (APP_PROPERTIES.ssr || !documentList || getCuratorDailyRewardPool <= 0 || !totalViewCountInfo || !latestRewardVoteList) return;
    let totalReward = 0;

    if (APP_PROPERTIES.debug) {
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

        if (APP_PROPERTIES.debug) {
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

          if (common.dateAgo(timestamp) <= 7 && common.dateAgo(timestamp) > 0) reward += this.curatorCalculateReward(getCuratorDailyRewardPool, v, tv, pv, tpvs);

          if (APP_PROPERTIES.debug) {
            console.log("%cNo." + Number(i + 1), "font-weight:bold");
            console.log("PV : " + pv);
            console.log("TPVS : " + tpvs);
            console.log("%c(" + getCuratorDailyRewardPool + " × (" + Math.pow(pv, 2) + " ÷ " + tpvs + ")) × (" + v + " ÷ " + tv + ")", "font-weight:bold");
            console.log("%cREWARD : $" + common.deckToDollar(common.toDeck(reward)), "color:red");
            console.log("\n");
          }
        }
        totalReward += reward;
      }
    }

    if (APP_PROPERTIES.debug) {
      console.log("\n\n");
      console.log("%cTOTAL REWARD : $" + common.deckToDollar(common.toDeck(totalReward)), "font-weight:bold;font-size:17px;color:purple");
      console.log("\n\n\n\n\n\n\n\n");
    }

    return totalReward;
  }
});
