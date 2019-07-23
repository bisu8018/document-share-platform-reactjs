import { connect } from "react-redux";
import ContentTags from "../../../components/body/contents/ContentTags";

export default connect(
  state => ({
    getTagList: state.main.tagList,
    getUploadTagList: state.main.uploadTagList,
  }),
  dispatch => ({})
)(ContentTags);
