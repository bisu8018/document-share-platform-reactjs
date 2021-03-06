import ReduxTypes from "../config/ReduxTypes";
import UserInfo from "../model/UserInfo";
import DocumentList from "../model/DocumentList";


// 액션 생성자
export const setAction = {
  initComplete: (initComplete: boolean) => ({ type: ReduxTypes.SET_INIT_COMPLETE, initComplete }),
  myInfo: (myInfo: any) => ({ type: ReduxTypes.SET_MY_INFO, myInfo }),
  tagList: (tagList: []) => ({ type: ReduxTypes.SET_TAG_LIST, tagList }),
  uploadTagList: (uploadTagList: []) => ({ type: ReduxTypes.SET_UPLOAD_TAG_LIST, uploadTagList }),
  isMobile: (isMobile: boolean) => ({ type: ReduxTypes.SET_IS_MOBILE, isMobile }),
  documentList: (documentList: {}) => ({ type: ReduxTypes.SET_DOCUMENT_LIST, documentList }),
  myList: (myList: {}) => ({ type: ReduxTypes.SET_MY_LIST, myList }),
  history: (history: {}) => ({ type: ReduxTypes.SET_HISTORY, history }),
  authorDailyRewardPool: (authorDailyRewardPool: number) => ({
    type: ReduxTypes.SET_AUTHOR_DAILY_REWARD_POOL,
    authorDailyRewardPool
  }),
  curatorDailyRewardPool: (curatorDailyRewardPool: number) => ({
    type: ReduxTypes.SET_CURATOR_DAILY_REWARD_POOL,
    curatorDailyRewardPool
  }),
  alertCode: (alertCode: any, alertData: any) => ({
    type: ReduxTypes.SET_ALERT_CODE,
    alertCode,
    alertData
  }),
  modal: (modalCode: any, modalData: any) => ({
    type: ReduxTypes.SET_MODAL,
    modalCode,
    modalData
  }),
};


// 초기 상태
const initState = {
  initComplete: false,
  myInfo: new UserInfo(),
  tagList: [],
  uploadTagList: [],
  myList: new DocumentList(),
  history: [],
  isMobile: null,
  authorDailyRewardPool: 0,
  curatorDailyRewardPool: 0,
  alertCode: null,
  alertData: {},
  modalCode: null,
  modalData: {},
  documentList: {},
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
    case ReduxTypes.SET_UPLOAD_TAG_LIST:
      return {
        ...state,
        uploadTagList: action.uploadTagList
      };
    case ReduxTypes.SET_IS_MOBILE:
      return {
        ...state,
        isMobile: action.isMobile
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
        alertCode: action.alertCode,
        alertData: action.alertData
      };
    case ReduxTypes.SET_MODAL:
      return {
        ...state,
        modalCode: action.modalCode,
        modalData: action.modalData,
      };
    case ReduxTypes.SET_DOCUMENT_LIST:
      return {
        ...state,
        documentList: action.documentList,
      };
    case ReduxTypes.SET_MY_LIST:
      return {
        ...state,
        myList: action.myList,
      };
    case ReduxTypes.SET_HISTORY:
      return {
        ...state,
        history: action.history,
      };
    default:
      return state;
  }
}
