import { connect } from "react-redux";
import ProfileCard from "../../components/common/card/ProfileCard";
import { setAction } from "../../redux/reducer/main";
import emailModal from "../../redux/reducer/emailModal";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
    getWeb3Apis: state.main.web3Apis,
    getTempEmail: state.emailModal.tempEmail
  }),
  dispatch => ({
    setMyInfo: (myInfo: any) => dispatch(setAction.myInfo(myInfo)),
    setTempEmail: (tempEmail: any) => dispatch(emailModal.setAction.tempEmail(tempEmail))
  })
)(ProfileCard);
