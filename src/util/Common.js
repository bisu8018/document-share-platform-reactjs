import { APP_PROPERTIES } from "../properties/app.properties";
import DrizzleApis from "../apis/DrizzleApis";
import MainRepository from "../redux/MainRepository";

const imgDomain = APP_PROPERTIES.domain().image;
//const apiDomain = APP_PROPERTIES.domain().api;

export default ({
    timestampToDateTime: (timestamp) => {
      let date = new Date(timestamp);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let year = date.getFullYear();
      let month = months[date.getMonth()];
      let day = date.getDate();
      let hour = date.getHours();
      let min = date.getMinutes();
      let sec = date.getSeconds();
      let time = day + " " + month + " " + year + " " + (hour < 10 ? "0" : "") + hour + ":" + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;

      return time;
    },
    timestampToDate: (timestamp) => {
      let date = new Date(timestamp);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let year = date.getFullYear();
      let month = months[date.getMonth()];
      let day = date.getDate();
      let _date = month + " " + day + ", " + year;

      return _date;
    },
    timestampToTime: (timestamp) => {
      let date = new Date(timestamp);
      let hour = date.getHours();
      let min = date.getMinutes();
      let sec = date.getSeconds();
      let time = (hour < 10 ? "0" : "") + hour + ":" + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;

      return time;
    },
    dateString: (date) => {
      let dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .split("T")[0];
      return dateString;
    },
    monthToString: (month) => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months[month - 1];
    },
    getMonday: (date) => {
      date = new Date(date);
      let day = date.getDay(),
        diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      return new Date(date.setDate(diff));
    },
    getWeeksCount: (year, month) => {
      const dayThreshold = [5, 1, 5, 6, 5, 6, 5, 5, 6, 5, 6, 5];
      let firstDay = new Date(year, month, 1).getDay();
      let baseWeeks = (month === 1 ? 4 : 5);

      return baseWeeks + (firstDay >= dayThreshold[month] ? 1 : 0);
    },
    setDateType: (year, month, date) => {
      let _date = year + "-" + (month < 10 ? "0" : "") + month + "-" + (date < 10 ? "0" : "") + date;
      return _date;
    },
    dateAgo: (timestamp) => {
      let currentDate = new Date();
      let lastDate = new Date(timestamp);
      let restDate = Math.floor((currentDate - lastDate) / (60 * 60 * 24 * 1000));


      return restDate;
    },
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
      let imageUrl = imgDomain + "/" + documentId + "/" + _size + "/" + pageNo;

      return imageUrl;
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
    mmCheck: () => {
      DrizzleApis.isAuthenticated();
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
      document.cookie = cname + "=" + cvalue + "; " + expires;
    },
    checkEmailForm: (email) => {
      let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

      return email.match(regExp);
    },
  }
);
