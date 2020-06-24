import { connect } from "react-redux";
import ModalList from "../../../components/common/modal/ModalList";
import { setAction } from "../../../redux/reducer/main";

export default connect(
  state => ({
    getModalCode: state.main.modalCode,
    getModalData: state.main.modalData,
    getAlertCode: state.main.alertCode,
  }),
  dispatch => ({
    setModal: (modalCode: any, modalData: any) => dispatch(setAction.modal(modalCode, modalData)),
  })
)(ModalList);
