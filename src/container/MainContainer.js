import { connect } from "react-redux";
import { setAction } from "../redux/reducer/main";
import Main from "../components/Main";


export default connect(
  state => ({
    getInitComplete: state.main.initComplete,
    getMyInfo: state.main.myInfo,
    getTagList: state.main.tagList,
    getUploadTagList: state.main.uploadTagList,
    getIsMobile: state.main.isMobile,
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
    getAlertCode: state.main.alertCode,
    getAway: state.header.away,
  }),
  dispatch => ({
    setInitComplete: (initComplete: boolean) => dispatch(setAction.initComplete(initComplete)),
    setMyInfo: (myInfo: any) => dispatch(setAction.myInfo(myInfo)),
    setTagList: (tagList: []) => dispatch(setAction.tagList(tagList)),
    setUploadTagList: (uploadTagList: []) => dispatch(setAction.uploadTagList(uploadTagList)),
    setMyList: (myList: []) => dispatch(setAction.myList(myList)),
    setHistory: (history: []) => dispatch(setAction.history(history)),
    setIsMobile: (isMobile: boolean) => dispatch(setAction.isMobile(isMobile)),
    setAuthorDailyRewardPool: (authorRewardPool: any) => dispatch(setAction.authorDailyRewardPool(authorRewardPool)),
    setCuratorDailyRewardPool: (curatorRewardPool: any) => dispatch(setAction.curatorDailyRewardPool(curatorRewardPool)),
    setWeb3Apis: () => dispatch(setAction.web3Apis()),
    setDrizzleApis: () => dispatch(setAction.drizzleApis())
  })
)(Main);
