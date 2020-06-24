import { connect } from "react-redux";
import DropZone from "../../components/common/DropZone";

export default connect(
  state => ({
    getIsMobile: state.main.isMobile,
  }),
  dispatch => ({
  })
)(DropZone);
