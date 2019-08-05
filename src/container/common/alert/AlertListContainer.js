import { connect } from "react-redux";
import { setAlertCode } from "../../../redux/reducer/main";
import AlertList from "../../../components/common/alert/AlertList";

export default connect(
  state => ({
    getAlertCode: state.main.alertCode,
    getAlertData: state.main.alertData,
  }),
  dispatch => ({
    setAlertCode: (alertCode: any, alertData: any) => {
      dispatch(setAlertCode(alertCode, alertData));
    },
  })
)(AlertList);
