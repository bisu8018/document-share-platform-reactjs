import { connect } from "react-redux";
import ProfileCard from "../../components/common/card/ProfileCard";
import { setMyInfo } from "../../redux/reducer/main";
import { setTempEmail } from "../../redux/reducer/emailModal";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
    getWeb3Apis: state.main.web3Apis,
    getTempEmail: state.emailModal.tempEmail
  }),
  dispatch => ({
    setMyInfo: (myInfo: any) => dispatch(setMyInfo(myInfo)),
    setTempEmail: (tempEmail: any) => dispatch(setTempEmail(tempEmail))
  })
)(ProfileCard);
