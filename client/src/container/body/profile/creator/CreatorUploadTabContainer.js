import { connect } from "react-redux";
import CreatorUploadTab from "../../../../components/body/profile/curator/CreatorUploadTab";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
  }),
  dispatch => ({})
)(CreatorUploadTab);
