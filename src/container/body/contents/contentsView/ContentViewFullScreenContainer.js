import { connect } from "react-redux";
import ContentViewFullScreen from "../../../../components/body/contents/contentsView/ContentViewFullScreen";
import { setAction } from "../../../../redux/reducer/main";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
    getMyInfo: state.main.myInfo,
    getMyList: state.main.myList,
    getIsMobile: state.main.isMobile
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode)),
    setMyList: (myList: []) => dispatch(setAction.myList(myList)),
  })
)(ContentViewFullScreen);
