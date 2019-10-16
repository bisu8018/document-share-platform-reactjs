import { connect } from "react-redux";
import { setAction } from "../../../redux/reducer/main";
import DollarPolicyModal from "../../../components/common/modal/DollarPolicyModal";

export default connect(
  state => ({
  }),
  dispatch => ({
    setModal: (modalCode: any, modalData: any) => dispatch(setAction.modal(modalCode, modalData)),
  })
)(DollarPolicyModal);
