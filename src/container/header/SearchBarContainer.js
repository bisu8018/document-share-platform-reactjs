import { connect } from "react-redux";
import SearchBar from "../../components/header/SearchBar";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
    getIsMobile: state.main.isMobile
  }),
  dispatch => ({})
)(SearchBar);
