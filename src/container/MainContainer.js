import { connect } from "react-redux";
import { setInitComplete, setMyInfo, setTagList } from "../redux/reducer/main";
import Main from "../components/Main";

const mapStateToProps = state => ({
  getInitComplete: state.main.initComplete,
  getMyInfo: state.main.myInfo,
  getTagList: state.main.myInfo,
});

const mapDispatchToProps = (dispatch: any) => ({
  setInitComplete: (initComplete: boolean) => {
    dispatch(setInitComplete(initComplete));
  },
  setMyInfo: (myInfo:any) => {
    dispatch(setMyInfo(myInfo));
  },
  setTagList: (tagList:[]) => {
    dispatch(setTagList(tagList));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);