import { connect } from "react-redux";
import Header from "../../components/header/Header";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
  }),
  dispatch => ({})
)(Header);