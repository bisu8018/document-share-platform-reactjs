import { connect } from "react-redux";
import { setAlertCode } from "../../../redux/reducer/main";
import DeleteDocumentModal from "../../../components/common/modal/DeleteDocumentModal";

export default connect(
  state => ({
    getDrizzle: state.main.drizzleApis,
    getMyInfo: state.main.myInfo,
    getWeb3Apis: state.main.web3Apis
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAlertCode(alertCode))
  })
)(DeleteDocumentModal);
