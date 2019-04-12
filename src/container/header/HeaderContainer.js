import { connect } from "react-redux";
import Header from "../../components/header/Header";

const mapStateToProps = state => ({
  getMyInfo: state.main.myInfo
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);