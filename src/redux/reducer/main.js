import ReduxTypes from "../config/ReduxTypes"
import UserInfo from "../model/UserInfo";
import Web3Apis from "../../apis/Web3Apis";
import DrizzleApis from "../../apis/DrizzleApis";


// 액션 생성자
export const setInitComplete = (initComplete:boolean) => ({ type: ReduxTypes.SET_INIT_COMPLETE, initComplete });
export const setMyInfo = (myInfo:any) => ({ type: ReduxTypes.SET_MY_INFO, myInfo });
export const setTagList = (tagList:[]) => ({ type: ReduxTypes.SET_TAG_LIST, tagList });
export const setIsMobile = (isMobile:boolean) => ({ type: ReduxTypes.SET_IS_MOBILE, isMobile });
export const setWeb3Apis = (web3Apis:any) => ({ type: ReduxTypes.SET_WEB3_APIS, web3Apis });
export const setDrizzleApis = (drizzleApis:any) => ({ type: ReduxTypes.SET_DRIZZLE_APIS, drizzleApis });

// 초기 상태
const initState = {
  initComplete: false,
  myInfo: new UserInfo(),
  tagList: [],
  isMobile: null,
  web3Apis: new Web3Apis(),
  drizzleApis: new DrizzleApis()
};

// 리듀서
export default (state = initState, action: any) => {
  switch(action.type) {
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
    default:
      return state
  }
}