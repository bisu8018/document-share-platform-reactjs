import { connect } from "react-redux";
import UploadDocumentModal from "../../../components/common/modal/UploadDocumentModal";
import { setAction } from "../../../redux/reducer/main";

export default connect(
  state => ({
    getUploadTagList: state.main.uploadTagList,
    getMyInfo: state.main.myInfo,
  }),
  dispatch => ({
    setMyInfo: (myInfo: any) => dispatch(setAction.myInfo(myInfo)),
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode)),
    setModal: (modalCode: any, modalData: any) => dispatch(setAction.modal(modalCode, modalData)),
  })
)(UploadDocumentModal);
