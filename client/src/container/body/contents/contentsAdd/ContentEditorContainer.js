import { connect } from "react-redux";
import { setAction } from "../../../../redux/reducer/main";
import ContentEditor from "../../../../components/body/contents/contentsAdd/ContentEditor";

export default connect(
  state => ({
    getUploadTagList: state.main.uploadTagList,
    getMyInfo: state.main.myInfo,
  }),
  dispatch => ({
    setMyInfo: (myInfo: any) => dispatch(setAction.myInfo(myInfo)),
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode))
  })
)(ContentEditor);
