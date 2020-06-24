import { connect } from "react-redux";
import ContentListItem from "../../../components/body/contents/contentsList/ContentListItem";
import { setAction } from "../../../redux/reducer/main";

export default connect(
  state => ({
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
    getIsMobile: state.main.isMobile,
    getMyList: state.main.myList,
    getMyInfo: state.main.myInfo,
  }),
  dispatch => ({
    setAuthorDailyRewardPool: (authorRewardPool: any) => dispatch(setAction.authorDailyRewardPool(authorRewardPool)),
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode)),
    setMyList: (myList: []) => dispatch(setAction.myList(myList)),
  })
)(ContentListItem);
