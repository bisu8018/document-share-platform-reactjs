import { connect } from "react-redux";
import AutoSuggestInput from "../../components/common/AutoSuggestInput";

const mapStateToProps = state => ({
  getTagList: state.main.tagList
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoSuggestInput);