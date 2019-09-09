import { connect } from "react-redux";
import { setAlertCode } from "../../redux/reducer/main";
import EmailVerify from "../../components/common/etc/EmailVerify";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAlertCode(alertCode))
  })
)(EmailVerify);
