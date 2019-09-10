import { connect } from "react-redux";
import UploadDocumentModal from "../../../components/common/modal/UploadDocumentModal";
import { setAction } from "../../../redux/reducer/main";

export default connect(
  state => ({
    getUploadTagList: state.main.uploadTagList,
    getDrizzle: state.main.drizzleApis,
    getMyInfo: state.main.myInfo,
    getWeb3Apis: state.main.web3Apis
  }),
  dispatch => ({
    setMyInfo: (myInfo: any) => dispatch(setAction.myInfo(myInfo)),
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode))
  })
)(UploadDocumentModal);
