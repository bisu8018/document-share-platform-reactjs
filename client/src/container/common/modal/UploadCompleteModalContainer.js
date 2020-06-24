import { connect } from "react-redux";
import { setAction } from "../../../redux/reducer/main";
import UploadCompleteModal from "../../../components/common/modal/UploadCompleteModal";

export default connect(
  state => ({
    getModalData: state.main.modalData
  }),
  dispatch => ({
    setModal: (modalCode: any, modalData: any) => dispatch(setAction.modal(modalCode, modalData))
  })
)(UploadCompleteModal);
