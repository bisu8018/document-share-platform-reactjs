import { connect } from "react-redux";
import Dropdown from "../../components/common/Dropdown";
import { setDropdownShow } from "../../redux/reducer/header";

export default connect(
  state => ({
    getDropdownShow: state.header.dropdownShow
  }),
  dispatch => ({
    setDropdownShow: (dropdownShow: boolean) => dispatch(setDropdownShow(dropdownShow)),
  })
)(Dropdown);