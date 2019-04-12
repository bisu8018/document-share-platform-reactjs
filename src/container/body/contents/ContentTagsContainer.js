import { connect } from "react-redux";
import ContentTags from "../../../components/body/contents/ContentTags";

const mapStateToProps = state => ({
  getTagList: state.main.tagList
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentTags);