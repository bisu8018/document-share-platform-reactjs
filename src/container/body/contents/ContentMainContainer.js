import { connect } from "react-redux";
import ContentMain from "../../../components/body/contents/contentsMain/ContentMain";
import { setAction } from "../../../redux/reducer/main";

export default connect(
  state => ({
    getTagList: state.main.tagList,
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
    getIsMobile: state.main.isMobile,
    getMyList: state.main.myList,
    getHistory: state.main.history,
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode))
  })
)(ContentMain);
