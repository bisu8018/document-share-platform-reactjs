import { connect } from "react-redux";
import ProfileCard from "../../components/common/card/ProfileCard";
import { setAction } from "../../redux/reducer/main";
import { setAction as emailModalAction } from "../../redux/reducer/emailModal";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
    getTempEmail: state.emailModal.tempEmail
  }),
  dispatch => ({
    setMyInfo: (myInfo: any) => dispatch(setAction.myInfo(myInfo)),
    setTempEmail: (tempEmail: any) => dispatch(emailModalAction.tempEmail(tempEmail))
  })
)(ProfileCard);
