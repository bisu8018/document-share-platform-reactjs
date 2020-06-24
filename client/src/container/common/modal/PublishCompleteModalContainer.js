import { connect } from "react-redux";
import { setAction } from "../../../redux/reducer/main";
import PublishCompleteModal from "../../../components/common/modal/PublishCompleteModal";

export default connect(
  state => ({
    getModalData: state.main.modalData
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode)),
    setModal: (modalCode: any, modalData: any) => dispatch(setAction.modal(modalCode, modalData))
  })
)(PublishCompleteModal);
