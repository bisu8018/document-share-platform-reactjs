import { connect } from "react-redux";
import UploadDocumentModal from "../../components/modal/UploadDocumentModal";

const mapStateToProps = state => ({
  getTagList: state.main.tagList,
  getDrizzle: state.main.drizzleApis,

});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadDocumentModal);