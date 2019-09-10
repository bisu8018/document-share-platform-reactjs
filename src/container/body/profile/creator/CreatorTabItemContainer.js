import { connect } from "react-redux";
import CreatorTabItem from "../../../../components/body/profile/creator/CreatorTabItem";
import { setAction } from "../../../../redux/reducer/main";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
    getIsMobile: state.main.isMobile,
    getMyInfo: state.main.myInfo
  }),
  dispatch => ({
    setAlertCode: (alertCode: any, alertData: any) => dispatch(setAction.alertCode(alertCode, alertData))
  })
)(CreatorTabItem);
