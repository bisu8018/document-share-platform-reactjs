import { connect } from "react-redux";
import EmailModal from "../../components/modal/EmailModal";
import { setMyInfo } from "../../redux/reducer/main";
import { setTempEmail } from "../../redux/reducer/emailModal";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo
  }),
  dispatch => ({
    setMyInfo: (myInfo:any) => {
      dispatch(setMyInfo(myInfo));
    },
    setTempEmail: (tempEmail:any) => {
      dispatch(setTempEmail(tempEmail));
    },
  })
)(EmailModal);