import { connect } from "react-redux";
import { setAction } from "../../../redux/reducer/main";
import PublishModal from "../../../components/common/modal/PublishModal";

export default connect(
  state => ({
    getDrizzle: state.main.drizzleApis,
    getMyInfo: state.main.myInfo,
    getWeb3Apis: state.main.web3Apis,
    getDrizzleApis: state.main.drizzleApis,
    getIsMobile: state.main.isMobile
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode))
  })
)(PublishModal);
