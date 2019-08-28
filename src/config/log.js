import { APP_PROPERTIES } from "../properties/app.properties";
import common from "../common/common";


// CSS 목록
let init = "text-shadow: 2px 2px 2px #3681fe;color:#3681fe;font-size:40px;font-weight:bold;";      // 초기화
let int = "color:blue";       // 숫자
let success = "color:green;font-weight:bold;";   // 성공
let failed = "color:red:font-weight:bold;";    // 실패
let component = "font-size:20px;font-weight:bold;background:#4d4d4d;color:white;border-radius:3px;padding:0 10px;margin:40px 0 10px 0";    // 컴포넌트
let objTitle = "font-weight:bold;color:purple";   // 오브젝트 제목
let categories = "font-weight:bold;text-transform: uppercase;";   // 카테고리


export default ({

  // Main.jsx
  Main: {
    init: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) {
          console.log("%cPOLARIS SHARE %c" + common.getVersion(), init, init + "font-size:25px !important;");
          console.log("%cMain.jsx", component);
        }
      } // else "Do something!"
    },
    setTagList: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("Tag List SETTING : %c COMPLETE", success);
        else console.log("Tag List SETTING : %c FAILED", failed, err);
      } // else "Do something!"
    },
    setUploadTagList: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("Upload Tag List SETTING : %c COMPLETE", success);
        else console.log("Upload Tag List SETTING : %c FAILED", failed, err);
      } // else "Do something!"
    },
    setIsMobile: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("Mobile Environment SETTING : %c COMPLETE", success);
        else console.log("Mobile Environment SETTING : %c FAILED", failed, err);
      } // else "Do something!"
    },
    setWeb3Apis: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("Web3 Environment SETTING : %c COMPLETE", success);
        else console.log("Web3 Environment SETTING : %c FAILED", failed, err);
      } // else "Do something!"
    },
    setDrizzleApis: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("Drizzle Environment SETTING : %c COMPLETE", success);
        else console.log("Drizzle Environment SETTING : %c FAILED", failed, err);
      } // else "Do something!"
    },
    setMyInfo: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("User Information SETTING : %c COMPLETE", success);
        else console.log("User Information SETTING : %c FAILED", failed, err);
      } // else "Do something!"
    },
    setAuthorDailyRewardPool: (err, pool) => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("Creator Reward Pool SETTING : %c COMPLETE %c \"" + pool + "\"", success, int);
        else console.log("Creator Reward Pool SETTING : %c FAILED", failed, err);
      } // else "Do something!"
    },
    setCuratorDailyRewardPool: (err, pool) => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("Curator Reward Pool SETTING : %c COMPLETE %c \"" + pool + "\"", success, int);
        else console.log("Curator Reward Pool SETTING : %c FAILED", failed, err);
      } // else "Do something!"
    }
  },

  // Header.jsx
  Header: {
    init: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("%cHeader.jsx", component);
      } // else "Do something!"
    }
  },

  // ContentMain.jsx
  ContentMain: {
    init: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("%cContentMain.jsx", component);
      } // else "Do something!"
    },
    getDocuments: (err, category) => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("%c\"" + category + "\" %cDocument List SETTING : %c COMPLETE", categories, "", success);
        else console.log("%c\"" + category + "\" %cDocument List SETTING : %c FAILED", categories, "", failed, err);
      } // else "Do something!"
    },
    handleResize: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("Scroll Event Listener START : %c COMPLETE", success);
        else console.log("Scroll Event Listener START : %c FAILED", failed, err);
      } // else "Do something!"
    },
    handleResizeEnd: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("Scroll Event Listener END : %c COMPLETE", success);
        else console.log("Scroll Event Listener END : %c FAILED", failed, err);
      } // else "Do something!"
    }
  },

  // ContentList.jsx
  ContentList: {
    init: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("%cContentList.jsx", component);
      } // else "Do something!"
    },
    fetchDocuments: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("Document List FETCHING : %c COMPLETE", success);
        else console.log("Document List FETCHING : %c FAILED", failed, err);
      } // else "Do something!"
    },
    setTagList: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("Content Tag List FETCHING : %c COMPLETE", success);
        else console.log("Content Tag List FETCHING : %c FAILED", failed, err);
      } // else "Do something!"
    }
  },

  // ContentView.jsx
  ContentView: {
    init: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("%cContentView.jsx", component);
      } // else "Do something!"
    },
    getContentInfo: (err, data) => {
      if (APP_PROPERTIES.debug) {
        if (!err) {
          console.log("Document Information SETTING : %c COMPLETE", success);
          console.log("%c Document Data", objTitle, data);
        } else console.log("Document Information SETTING : %c FAILED", failed, err);
      } // else "Do something!"
    }
  },

  // ContentViewFullscreen.jsx
  ContentViewFullscreen: {
    init: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("%cContentViewFullscreen.jsx", component);
      } // else "Do something!"
    },
    getContentDownload: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("Document Download Url SETTING : %c COMPLETE", success);
        else console.log("Document Download Url SETTING : %c FAILED", failed, err);
      } // else "Do something!"
    },
    getReward: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("User Reward SETTING : %c COMPLETE", success);
        else console.log("User Reward SETTING : %c FAILED", failed, err);
      } // else "Do something!"
    }
  },

  // Creator.jsx
  Creator: {
    init: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("%cCreator.jsx", component);
      } // else "Do something!"
    },
    getProfileInfo: (err, data) => {
      if (APP_PROPERTIES.debug) {
        if (!err) {
          console.log("Profile Information SETTING : %c COMPLETE", success);
          console.log("%c Profile Data", objTitle, data);
        } else console.log("Profile Information SETTING : %c FAILED", failed, err);
      } // else "Do something!"
    }
  },

  // CreatorSummary.jsx
  CreatorSummary: {
    init: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("%cCreatorSummary.jsx", component);
      } // else "Do something!"
    },
    getBalance: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("Balance SETTING : %c COMPLETE", success);
        else console.log("Balance SETTING : %c FAILED", failed, err);
      } // else "Do something!"
    }
  },

  // CreatorUploadTab.jsx
  CreatorUploadTab: {
    init: err => {
      if (APP_PROPERTIES.debug) {
        if (!err) console.log("%cCreatorUploadTab.jsx", component);
      } // else "Do something!"
    }
  }
});
