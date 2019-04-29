import { connect } from "react-redux";
import ContentViewCarousel from "../../../../components/body/contents/contentsView/ContentViewCarousel";

export default connect(
  state => ({getMyInfo: state.main.myInfo }),
  dispatch => ({})
)(ContentViewCarousel);