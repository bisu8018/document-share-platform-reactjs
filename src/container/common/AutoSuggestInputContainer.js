import { connect } from "react-redux";
import AutoSuggestInput from "../../components/common/AutoSuggestInput";

export default connect(
  state => ({
    getTagList: state.main.tagList
  }),
  dispatch => ({})
)(AutoSuggestInput);