import { connect } from "react-redux";
import Category from "../../components/header/Category";

export default connect(
  state => ({
    getTagList: state.main.tagList
  }),
  dispatch => ({})
)(Category);
