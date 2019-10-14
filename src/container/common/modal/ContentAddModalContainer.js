import { connect } from "react-redux";
import { setAction } from "../../../redux/reducer/main";
import ContentAddModal from "../../../components/common/modal/ContentAddModal";

export default connect(
  state => ({
    getDrizzle: state.main.drizzleApis,
    getMyInfo: state.main.myInfo,
    getWeb3Apis: state.main.web3Apis,
    getDrizzleApis: state.main.drizzleApis,
    getIsMobile: state.main.isMobile,
    getUploadTagList: state.main.uploadTagList,

  }),
  dispatch => ({
    setMyInfo: (myInfo: any) => dispatch(setAction.myInfo(myInfo)),
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode))
  })
)(ContentAddModal);
