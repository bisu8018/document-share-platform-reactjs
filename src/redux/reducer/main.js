import ReduxTypes from "../config/ReduxTypes";
import UserInfo from "../model/UserInfo";
import Web3Apis from "../../apis/Web3Apis";
import DrizzleApis from "../../apis/DrizzleApis";

// 액션 생성자
export const setInitComplete = (initComplete: boolean) => ({ type: ReduxTypes.SET_INIT_COMPLETE, initComplete });
export const setMyInfo = (myInfo: any) => ({ type: ReduxTypes.SET_MY_INFO, myInfo });
export const setTagList = (tagList: []) => ({ type: ReduxTypes.SET_TAG_LIST, tagList });
export const setCurrentTagList = (currentTagList: []) => ({ type: ReduxTypes.SET_CURRENT_TAG_LIST, currentTagList });
export const setIsMobile = (isMobile: boolean) => ({ type: ReduxTypes.SET_IS_MOBILE, isMobile });
export const setWeb3Apis = (web3Apis: any) => ({ type: ReduxTypes.SET_WEB3_APIS, web3Apis });
export const setDrizzleApis = () => ({ type: ReduxTypes.SET_DRIZZLE_APIS, drizzleApis: new DrizzleApis() });
export const setAuthorDailyRewardPool = (authorDailyRewardPool: number) => ({
  type: ReduxTypes.SET_AUTHOR_DAILY_REWARD_POOL,
  authorDailyRewardPool
});
export const setCuratorDailyRewardPool = (curatorDailyRewardPool: number) => ({
  type: ReduxTypes.SET_CURATOR_DAILY_REWARD_POOL,
  curatorDailyRewardPool
});
export const setAlertCode = (alertCode: number) => ({ type: ReduxTypes.SET_ALERT_CODE, alertCode });

// 초기 상태
const initState = {
  initComplete: false,
  myInfo: new UserInfo(),
  tagList: [],
  currentTagList: [],
  isMobile: null,
  web3Apis: new Web3Apis(),
  drizzleApis: new DrizzleApis(),
  authorDailyRewardPool: 0,
  curatorDailyRewardPool: 0,
  alertCode: null
};

// 리듀서
export default (state = initState, action: any) => {
  switch (action.type) {
    case ReduxTypes.SET_INIT_COMPLETE:
      return {
        ...state,
        initComplete: action.initComplete
      };
    case ReduxTypes.SET_MY_INFO:
      return {
        ...state,
        myInfo: action.myInfo
      };
    case ReduxTypes.SET_TAG_LIST:
      return {
        ...state,
        tagList: action.tagList
      };
    case ReduxTypes.SET_CURRENT_TAG_LIST:
      return {
        ...state,
        currentTagList: action.currentTagList
      };
    case ReduxTypes.SET_IS_MOBILE:
      return {
        ...state,
        isMobile: action.isMobile
      };
    case ReduxTypes.SET_WEB3_APIS:
      return {
        ...state,
        web3Apis: action.web3Apis
      };
    case ReduxTypes.SET_DRIZZLE_APIS:
      return {
        ...state,
        drizzleApis: action.drizzleApis
      };
    case ReduxTypes.SET_AUTHOR_DAILY_REWARD_POOL:
      return {
        ...state,
        authorDailyRewardPool: action.authorDailyRewardPool
      };
    case ReduxTypes.SET_CURATOR_DAILY_REWARD_POOL:
      return {
        ...state,
        curatorDailyRewardPool: action.curatorDailyRewardPool
      };
    case ReduxTypes.SET_ALERT_CODE:
      return {
        ...state,
        alertCode: action.alertCode
      };
    default:
      return state;
  }
}