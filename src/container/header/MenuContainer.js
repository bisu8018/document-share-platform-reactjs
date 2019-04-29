import { connect } from "react-redux";
import Menu from "../../components/header/Menu";
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
)(Menu);