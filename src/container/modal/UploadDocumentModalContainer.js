import { connect } from "react-redux";
import UploadDocumentModal from "../../components/modal/UploadDocumentModal";

export default connect(
  state => ({
    getTagList: state.main.tagList,
    getDrizzle: state.main.drizzleApis,
    getMyInfo: state.main.myInfo,
  }),
  dispatch => ({})
)(UploadDocumentModal);