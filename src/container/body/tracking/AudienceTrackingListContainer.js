import { connect } from "react-redux";
import AudienceTrackingList from "../../../components/body/tracking/AudienceTrackingList";
import { setShowAnonymous, setIncludeOnlyOnePage } from "../../../redux/reducer/audienceTracking";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getShowAnonymous: state.audienceTracking.showAnonymous,
    getIncludeOnlyOnePage: state.audienceTracking.includeOnlyOnePage,
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
  }),
  dispatch => ({
    setShowAnonymous: (showAnonymous: boolean, callback) => {
      dispatch(setShowAnonymous(showAnonymous, () => {
        callback();
      }));
    },
    setIncludeOnlyOnePage: (includeOnlyOnePage: boolean, callback) => {
      dispatch(setIncludeOnlyOnePage(includeOnlyOnePage, () => {
        callback();
      }));
    },
  }),
)(AudienceTrackingList);