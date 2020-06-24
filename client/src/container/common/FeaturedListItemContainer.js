import { connect } from "react-redux";
import FeaturedListItem from "../../components/common/FeaturedListItem";
import { setAction as contentView } from "../../redux/reducer/contentView";

export default connect(
  state => ({
    getTagList: state.main.tagList,
  }),
  dispatch => ({
    setDocument: (document: any) => dispatch(contentView.document(document)),
  })
)(FeaturedListItem);
