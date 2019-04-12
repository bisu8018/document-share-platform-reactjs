import { connect } from "react-redux";
import EditDocumentModal from "../../components/modal/EditDocumentModal";

const mapStateToProps = state => ({
  getTagList: state.main.tagList
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditDocumentModal);