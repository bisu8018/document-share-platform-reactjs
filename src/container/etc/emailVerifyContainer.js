import { connect } from "react-redux";
import { setAlertCode } from "../../redux/reducer/main";
import emailVerify from "../../components/etc/emailVerify";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis
  }),
  dispatch => ({
    setAlertCode: (alertCode: number) => {
      dispatch(setAlertCode(alertCode));
    },
  })
)(emailVerify);