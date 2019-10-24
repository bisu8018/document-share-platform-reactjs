import { connect } from "react-redux";
import { setAction } from "../../../redux/reducer/main";
import PublishModal from "../../../components/common/modal/PublishModal";

export default connect(
  state => ({
    getDrizzleApis: state.main.drizzleApis,
    getIsMobile: state.main.isMobile,
    getModalData: state.main.modalData,
    getTagList: state.main.tagList
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode)),
    setModal: (modalCode: any, modalData: any) => dispatch(setAction.modal(modalCode, modalData)),
  })
)(PublishModal);
