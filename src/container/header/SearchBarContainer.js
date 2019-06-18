import { connect } from "react-redux";
import { setCurrentTagList } from "../../redux/reducer/main";
import SearchBar from "../../components/header/SearchBar";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
    getIsMobile: state.main.isMobile,
  }),
  dispatch => ({
    setCurrentTagList: (currentTagList: []) => dispatch(setCurrentTagList(currentTagList)),
  })
)(SearchBar);