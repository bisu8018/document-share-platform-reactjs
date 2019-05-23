import { connect } from "react-redux";
import ProfileCard from "../../components/common/ProfileCard";
import { setMyInfo } from "../../redux/reducer/main";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
    getWeb3Apis: state.main.web3Apis,
  }),
  dispatch => ({
    setMyInfo: (myInfo: any) => dispatch(setMyInfo(myInfo)),
  })
)(ProfileCard);