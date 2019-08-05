import { connect } from "react-redux";
import Callback from "../../../components/body/callback/Callback";
import { setAlertCode, setMyInfo } from "../../../redux/reducer/main";
import { setTempEmail } from "../../../redux/reducer/emailModal";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
  }),
  dispatch => ({
    setMyInfo: (myInfo: any) => {
      dispatch(setMyInfo(myInfo));
    },
    setTempEmail: (tempEmail: any) => {
      dispatch(setTempEmail(tempEmail));
    },
    setAlertCode: (alertCode: any) => {
      dispatch(setAlertCode(alertCode));
    }
  })
)(Callback);
