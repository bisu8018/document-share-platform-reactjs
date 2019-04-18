import { connect } from "react-redux";
import { setInitComplete, setIsMobile, setMyInfo, setTagList, setWeb3Apis } from "../redux/reducer/main";
import Main from "../components/Main";

const mapStateToProps = state => ({
  getInitComplete: state.main.initComplete,
  getMyInfo: state.main.myInfo,
  getTagList: state.main.myInfo,
  getIsMobile: state.main.isMobile,
  getWeb3Apis: state.main.web3Apis,
  getDrizzle: state.main.drizzleApis,
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
  setIsMobile: (isMobile:boolean) => {
    dispatch(setIsMobile(isMobile));
  },
  setWeb3Apis: (web3apis:any) => {
    dispatch(setWeb3Apis(web3apis));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);