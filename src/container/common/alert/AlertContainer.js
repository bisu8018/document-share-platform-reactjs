import { connect } from "react-redux";
import Alert from "../../../components/common/alert/Alert";
import { setAlertCode } from "../../../redux/reducer/main";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getMyInfo: state.main.myInfo
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAlertCode(alertCode))
  })
)(Alert);
