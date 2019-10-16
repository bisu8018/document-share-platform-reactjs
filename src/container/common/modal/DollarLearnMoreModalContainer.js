import { connect } from "react-redux";
import { setAction } from "../../../redux/reducer/main";
import DollarLearnMoreModal from "../../../components/common/modal/DollarLearnMoreModal";

export default connect(
  state => ({
  }),
  dispatch => ({
    setModal: (modalCode: any, modalData: any) => dispatch(setAction.modal(modalCode, modalData)),
  })
)(DollarLearnMoreModal);
