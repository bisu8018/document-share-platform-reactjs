import { connect } from "react-redux";
import Header from "../../components/header/Header";
import { setCurrentTagList } from "../../redux/reducer/main";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
  }),
  dispatch => ({
    setCurrentTagList: (currentTagList: []) => dispatch(setCurrentTagList(currentTagList)),
  })
)(Header);