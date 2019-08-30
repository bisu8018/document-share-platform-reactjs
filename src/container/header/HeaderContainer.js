import { connect } from "react-redux";
import Header from "../../components/header/Header";
import { setIsMobile } from "../../redux/reducer/main";
import { setAway } from "../../redux/reducer/header";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
    getTempEmail: state.emailModal.tempEmail,
    getIsMobile: state.main.isMobile,
    getAway: state.header.away
  }),
  dispatch => ({
    setIsMobile: (isMobile: boolean) => dispatch(setIsMobile(isMobile)),
    setAway: (away: boolean) => dispatch(setAway(away))
  })
)(Header);
