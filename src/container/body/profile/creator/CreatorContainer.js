import { connect } from "react-redux";
import Creator from "../../../../components/body/profile/creator/Creator";
import { setAction } from "../../../../redux/reducer/main";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode)),
  })
)(Creator);
