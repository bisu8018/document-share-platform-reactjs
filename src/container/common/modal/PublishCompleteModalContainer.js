import { connect } from "react-redux";
import { setAlertCode } from "../../../redux/reducer/main";
import PublishCompleteModal from "../../../components/common/modal/PublishCompleteModal";

export default connect(
  state => ({
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAlertCode(alertCode))
  })
)(PublishCompleteModal);
