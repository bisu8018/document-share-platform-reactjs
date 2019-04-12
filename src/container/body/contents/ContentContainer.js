import { connect } from "react-redux";
import ContentContainer from "../../../components/body/contents/ContentContainer";

const mapStateToProps = state => ({
  getTagList: state.main.tagList
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentContainer);