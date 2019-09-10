import { connect } from "react-redux";
import { setAction } from "../../../redux/reducer/main";
import PublishCompleteModal from "../../../components/common/modal/PublishCompleteModal";

export default connect(
  state => ({}),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode))
  })
)(PublishCompleteModal);
