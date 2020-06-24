import { connect } from "react-redux";
import CreatorClaim from "../../../../components/body/profile/creator/CreatorClaim";
import { setAction } from "../../../../redux/reducer/main";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
    getIsMobile: state.main.isMobile
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode))
  })
)(CreatorClaim);
