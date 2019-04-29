import { connect } from "react-redux";
import Alert from "../../components/common/Alert";
import { setAlertCode } from "../../redux/reducer/main";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis
  }),
  dispatch => ({
    setAlertCode: (alertCode: number) => {
      dispatch(setAlertCode(alertCode));
    },
  })
)(Alert);