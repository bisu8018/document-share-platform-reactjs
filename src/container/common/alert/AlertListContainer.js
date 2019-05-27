import { connect } from "react-redux";
import { setAlertCode } from "../../../redux/reducer/main";
import AlertList from "../../../components/common/alert/AlertList";

export default connect(
  state => ({
    getAlertCode: state.main.alertCode
  }),
  dispatch => ({
    setAlertCode: (alertCode: number) => {
      dispatch(setAlertCode(alertCode));
    },
  })
)(AlertList);