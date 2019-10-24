import { connect } from "react-redux";
import { setAction } from "../../../../redux/reducer/main";
import { setAction as contentView } from "../../../../redux/reducer/contentView";
import ContentViewPortrait from "../../../../components/body/contents/contentsView/ContentViewPortrait";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
    getTempEmail: state.emailModal.tempEmail,
    getDocument: state.contentView.document
  }),
  dispatch => ({
    setMyInfo: (myInfo: any) => dispatch(setAction.myInfo(myInfo)),
    setDocument: (document: any) => dispatch(contentView.document(document)),
  })
)(ContentViewPortrait);
