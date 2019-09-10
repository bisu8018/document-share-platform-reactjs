import { connect } from "react-redux";
import Header from "../../components/header/Header";
import { setAction } from "../../redux/reducer/main";
import header from "../../redux/reducer/header";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
    getTempEmail: state.emailModal.tempEmail,
    getIsMobile: state.main.isMobile,
    getAway: state.header.away
  }),
  dispatch => ({
    setIsMobile: (isMobile: boolean) => dispatch(setAction.isMobile(isMobile)),
    setAway: (away: boolean) => dispatch(header.setAction.away(away))
  })
)(Header);
