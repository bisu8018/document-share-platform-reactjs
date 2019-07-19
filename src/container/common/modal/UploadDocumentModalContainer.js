import { connect } from "react-redux";
import UploadDocumentModal from "../../../components/common/modal/UploadDocumentModal";
import { setAlertCode } from "../../../redux/reducer/main";

export default connect(
  state => ({
    getUploadTagList: state.main.uploadTagList,
    getDrizzle: state.main.drizzleApis,
    getMyInfo: state.main.myInfo,
    getWeb3Apis: state.main.web3Apis,
  }),
  dispatch => ({
    setAlertCode: (alertCode: number) => {
      dispatch(setAlertCode(alertCode));
    }
  })
)(UploadDocumentModal);
