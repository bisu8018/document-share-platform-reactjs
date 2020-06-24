import { connect } from "react-redux";
import CuratorClaim from "../../../../components/body/profile/curator/CuratorClaim";
import { setAction } from "../../../../redux/reducer/main";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
    getIsMobile: state.main.isMobile
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode))
  })
)(CuratorClaim);
