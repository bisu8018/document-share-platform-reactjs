import { connect } from "react-redux";
import ContentViewFullScreen from "../../../../components/body/contents/contentsView/ContentViewFullScreen";
import { setAction } from "../../../../redux/reducer/main";
import { setAction as contentView } from "../../../../redux/reducer/contentView";

export default connect(
  state => ({
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
    getMyInfo: state.main.myInfo,
    getMyList: state.main.myList,
    getIsMobile: state.main.isMobile,
    getDocument: state.contentView.document
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode)),
    setMyList: (myList: []) => dispatch(setAction.myList(myList)),
    setDocument: (document: any) => dispatch(contentView.document(document)),
    setModal: (modalCode: any, modalData: any) => dispatch(setAction.modal(modalCode, modalData)),
  })
)(ContentViewFullScreen);
