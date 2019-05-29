import { connect } from "react-redux";
import {
  setAuthorDailyRewardPool, setCuratorDailyRewardPool, setCurrentTagList,
  setInitComplete,
  setIsMobile,
  setMyInfo,
  setTagList,
  setWeb3Apis
} from "../redux/reducer/main";
import Main from "../components/Main";

export default connect(
  state => ({
    getInitComplete: state.main.initComplete,
    getMyInfo: state.main.myInfo,
    getTagList: state.main.tagList,
    getCurrentTagList: state.main.currentTagList,
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
    setCurrentTagList: (currentTagList: []) => dispatch(setCurrentTagList(currentTagList)),
    setIsMobile: (isMobile: boolean) => dispatch(setIsMobile(isMobile)),
    setWeb3Apis: (web3apis: any) => dispatch(setWeb3Apis(web3apis)),
    setAuthorDailyRewardPool: (authorRewardPool: any) => dispatch(setAuthorDailyRewardPool(authorRewardPool)),
    setCuratorDailyRewardPool: (curatorRewardPool: any) => dispatch(setCuratorDailyRewardPool(curatorRewardPool))
  })
)(Main);