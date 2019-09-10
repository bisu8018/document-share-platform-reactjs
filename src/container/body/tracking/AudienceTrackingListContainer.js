import { connect } from "react-redux";
import AudienceTrackingList from "../../../components/body/tracking/AudienceTrackingList";
import { setAction } from "../../../redux/reducer/audienceTracking";
import main from "../../../redux/reducer/main";

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
      setAction.showAnonymous(showAnonymous, dispatch, () => callback()),
    setIncludeOnlyOnePage: (includeOnlyOnePage: boolean, callback) =>
      setAction.includeOnlyOnePage(includeOnlyOnePage, dispatch, () => callback()),
    setAlertCode: (alertCode: any) => dispatch(main.setAction.alertCode(alertCode))
  })
)(AudienceTrackingList);
