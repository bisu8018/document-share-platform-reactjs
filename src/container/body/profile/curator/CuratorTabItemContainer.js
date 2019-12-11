import { connect } from "react-redux";
import CuratorTabItem from "../../../../components/body/profile/curator/CuratorTabItem";

export default connect(
  state => ({
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
    getIsMobile: state.main.isMobile
  }),
  dispatch => ({})
)(CuratorTabItem);