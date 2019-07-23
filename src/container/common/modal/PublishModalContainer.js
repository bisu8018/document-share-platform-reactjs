import { connect } from "react-redux";
import { setAlertCode } from "../../../redux/reducer/main";
import PublishModal from "../../../components/common/modal/PublishModal";

export default connect(
  state => ({
    getDrizzle: state.main.drizzleApis,
    getMyInfo: state.main.myInfo,
    getWeb3Apis: state.main.web3Apis,
    getIsMobile: state.main.isMobile,
  }),
  dispatch => ({
    setAlertCode: (alertCode: number) => {
      dispatch(setAlertCode(alertCode));
    }
  })
)(PublishModal);
