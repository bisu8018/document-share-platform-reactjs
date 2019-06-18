import { connect } from "react-redux";
import Header from "../../components/header/Header";
import { setCurrentTagList } from "../../redux/reducer/main";
import { setDropdownShow } from "../../redux/reducer/header";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
    getTempEmail: state.emailModal.tempEmail,
    getIsMobile: state.main.isMobile,
    getDropdownShow: state.header.dropdownShow
  }),
  dispatch => ({
    setCurrentTagList: (currentTagList: []) => dispatch(setCurrentTagList(currentTagList)),
    setDropdownShow: (dropdownShow: boolean) => dispatch(setDropdownShow(dropdownShow)),
  })
)(Header);