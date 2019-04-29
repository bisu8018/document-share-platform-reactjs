import { connect } from "react-redux";
import Callback from "../../../components/body/callback/Callback";
import { setMyInfo } from "../../../redux/reducer/main";

export default connect(
  state => ({}),
  dispatch => ({
    setMyInfo: (myInfo:any) => {
      dispatch(setMyInfo(myInfo));
    },
  })
)(Callback);