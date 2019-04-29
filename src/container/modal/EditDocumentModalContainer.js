import { connect } from "react-redux";
import EditDocumentModal from "../../components/modal/EditDocumentModal";

export default connect(
  state => ({
    getTagList: state.main.tagList
  }),
  dispatch => ({})
)(EditDocumentModal);