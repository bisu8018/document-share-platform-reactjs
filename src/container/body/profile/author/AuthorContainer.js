import { connect } from "react-redux";
import Author from "../../../../components/body/profile/author/Author";

const mapStateToProps = state => ({
  getMyInfo: state.main.myInfo
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Author);