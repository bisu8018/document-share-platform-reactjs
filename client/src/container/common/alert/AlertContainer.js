import { connect } from "react-redux";
import Alert from "../../../components/common/alert/Alert";
import { setAction } from "../../../redux/reducer/main";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode))
  })
)(Alert);
