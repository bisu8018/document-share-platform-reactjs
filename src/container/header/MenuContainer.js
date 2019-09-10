import { connect } from "react-redux";
import Menu from "../../components/header/Menu";
import { setAction } from "../../redux/reducer/main";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
    getTempEmail: state.emailModal.tempEmail,
    getIsMobile: state.main.isMobile
  }),
  dispatch => ({
    setMyInfo: (myInfo: any) => dispatch(setAction.myInfo(myInfo))
  })
)(Menu);
