import { connect } from "react-redux";
import {
  setAuthorDailyRewardPool,
  setCuratorDailyRewardPool,
  setInitComplete,
  setIsMobile,
  setMyInfo,
  setTagList,
  setUploadTagList,
  setWeb3Apis
} from "../redux/reducer/main";
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
    getAlertCode: state.main.alertCode
  }),
  dispatch => ({
    setInitComplete: (initComplete: boolean) => dispatch(setInitComplete(initComplete)),
    setMyInfo: (myInfo: any) => dispatch(setMyInfo(myInfo)),
    setTagList: (tagList: []) => dispatch(setTagList(tagList)),
    setUploadTagList: (uploadTagList: []) => dispatch(setUploadTagList(uploadTagList)),
    setIsMobile: (isMobile: boolean) => dispatch(setIsMobile(isMobile)),
    setWeb3Apis: (web3apis: any) => dispatch(setWeb3Apis(web3apis)),
    setAuthorDailyRewardPool: (authorRewardPool: any) => dispatch(setAuthorDailyRewardPool(authorRewardPool)),
    setCuratorDailyRewardPool: (curatorRewardPool: any) => dispatch(setCuratorDailyRewardPool(curatorRewardPool))
  })
)(Main);
