import { connect } from "react-redux";
import EmailModal from "../../components/modal/EmailModal";
import { setMyInfo } from "../../redux/reducer/main";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo
  }),
  dispatch => ({
    setMyInfo: (myInfo:any) => {
      dispatch(setMyInfo(myInfo));
    },
  })
)(EmailModal);