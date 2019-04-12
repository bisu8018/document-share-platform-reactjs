import ReduxTypes from "../config/ReduxTypes"
import UserInfo from "../model/UserInfo";


// 액션 생성자
export const setInitComplete = (initComplete:boolean) => ({ type: ReduxTypes.SET_INIT_COMPLETE, initComplete });
export const setMyInfo = (myInfo:any) => ({ type: ReduxTypes.SET_MY_INFO, myInfo });
export const setTagList = (tagList:[]) => ({ type: ReduxTypes.SET_TAG_LIST, tagList });

// 초기 상태
const initState = {
  initComplete: false,
  myInfo: new UserInfo(),
  tagList: [],
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
    default:
      return state
  }
}