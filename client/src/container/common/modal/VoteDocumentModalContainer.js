import { connect } from "react-redux";
import VoteDocument from "../../../components/common/modal/VoteDocumentModal";
import { setAction } from "../../../redux/reducer/main";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode))
  })
)(VoteDocument);
