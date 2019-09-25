import { connect } from "react-redux";
import { setAction } from "../../../redux/reducer/main";
import AnalyticsModal from "../../../components/common/modal/AnalyticsModal";

export default connect(
  state => ({}),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode)),
  })
)(AnalyticsModal);
