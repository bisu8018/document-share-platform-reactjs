import { connect } from "react-redux";
import AudienceTrackingList from "../../../components/body/tracking/AudienceTrackingList";
import { setShowAnonymous, setIncludeOnlyOnePage } from "../../../redux/reducer/audienceTracking";
import { setAlertCode } from "../../../redux/reducer/main";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getShowAnonymous: state.audienceTracking.showAnonymous,
    getIncludeOnlyOnePage: state.audienceTracking.includeOnlyOnePage,
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
    getIsMobile: state.main.isMobile
  }),
  dispatch => ({
    setShowAnonymous: (showAnonymous: boolean, callback) =>
      setShowAnonymous(showAnonymous, dispatch, () => callback()),
    setIncludeOnlyOnePage: (includeOnlyOnePage: boolean, callback) =>
      setIncludeOnlyOnePage(includeOnlyOnePage, dispatch, () => callback()),
    setAlertCode: (alertCode: any) => dispatch(setAlertCode(alertCode))
  })
)(AudienceTrackingList);
