import { connect } from "react-redux";
import EditDocumentModal from "../../../components/common/modal/EditDocumentModal";

export default connect(
  state => ({
    getTagList: state.main.tagList
  }),
  dispatch => ({})
)(EditDocumentModal);
