import { connect } from "react-redux";
import CreatorClaim from "../../../../components/body/profile/creator/CreatorClaim";
import { setAlertCode } from "../../../../redux/reducer/main";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getMyInfo: state.main.myInfo,
    getIsMobile: state.main.isMobile
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => {
      dispatch(setAlertCode(alertCode));
    },
  })
)(CreatorClaim);
