import { connect } from "react-redux";
import Callback from "../../../components/body/callback/Callback";
import { setAction } from "../../../redux/reducer/main";
import { setAction as emailModalAction } from "../../../redux/reducer/emailModal";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo
  }),
  dispatch => ({
    setMyInfo: (myInfo: any) => dispatch(setAction.myInfo(myInfo)),
    setTempEmail: (tempEmail: any) => dispatch(emailModalAction.tempEmail(tempEmail)),
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode)),
    setMyList: (myList: []) => dispatch(setAction.myList(myList)),
    setHistory: (history: []) => dispatch(setAction.history(history)),
  })
)(Callback);
