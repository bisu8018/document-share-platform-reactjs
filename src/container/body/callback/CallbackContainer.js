import { connect } from "react-redux";
import Callback from "../../../components/body/callback/Callback";
import { setMyInfo } from "../../../redux/reducer/main";
import { setTempEmail } from "../../../redux/reducer/emailModal";

export default connect(
  state => ({}),
  dispatch => ({
    setMyInfo: (myInfo:any) => {dispatch(setMyInfo(myInfo));},
    setTempEmail: (tempEmail:any) => {
      dispatch(setTempEmail(tempEmail));
    },
  })
)(Callback);