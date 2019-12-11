import { connect } from "react-redux";
import { setAction } from "../../../redux/reducer/main";
import DeleteDocumentModal from "../../../components/common/modal/DeleteDocumentModal";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode))
  })
)(DeleteDocumentModal);
