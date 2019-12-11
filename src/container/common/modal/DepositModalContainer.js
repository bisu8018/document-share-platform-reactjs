import { connect } from "react-redux";
import { setAction } from "../../../redux/reducer/main";
import DepositModal from "../../../components/common/modal/DepositModal";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode)),
    setModal: (modalCode: any, modalData: any) => dispatch(setAction.modal(modalCode, modalData)),
  })
)(DepositModal);
