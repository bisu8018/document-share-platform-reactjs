import { connect } from "react-redux";
import { setAction } from "../../../redux/reducer/main";
import ImageCropModal from "../../../components/common/modal/ImageCropModal";

export default connect(
  state => ({
    getModalData: state.main.modalData,
    getMyInfo: state.main.myInfo
  }),
  dispatch => ({
    setModal: (modalCode: any, modalData: any) => dispatch(setAction.modal(modalCode, modalData)),
    setMyInfo: (myInfo: any) => dispatch(setAction.myInfo(myInfo)),
  })
)(ImageCropModal);
