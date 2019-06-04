import { connect } from "react-redux";
import CuratorUploadTab from "../../../../components/body/profile/curator/CuratorUploadTab";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
  }),
  dispatch => ({})
)(CuratorUploadTab);