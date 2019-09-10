import { connect } from "react-redux";
import Callback from "../../../components/body/callback/Callback";
import  { setAction }  from "../../../redux/reducer/main";
import emailModal from "../../../redux/reducer/emailModal";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo
  }),
  dispatch => ({
    setMyInfo: (myInfo: any) => {
      dispatch(setAction.myInfo(myInfo))
    },
    setTempEmail: (tempEmail: any) => dispatch(emailModal.setAction.tempEmail(tempEmail)),
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode))
  })
)(Callback);
