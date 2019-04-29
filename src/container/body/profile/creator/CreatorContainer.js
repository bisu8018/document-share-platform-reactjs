import { connect } from "react-redux";
import Creator from "../../../../components/body/profile/creator/Creator";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo
  }),
  dispatch => ({})
)(Creator);