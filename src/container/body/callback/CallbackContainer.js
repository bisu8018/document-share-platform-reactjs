import { connect } from "react-redux";
import Callback from "../../../components/body/callback/Callback";
import { setMyInfo } from "../../../redux/reducer/main";

const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch: any) => ({
  setMyInfo: (myInfo:any) => {
    dispatch(setMyInfo(myInfo));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Callback);