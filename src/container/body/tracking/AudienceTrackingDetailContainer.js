import { connect } from "react-redux";
import AudienceTrackingDetail from "../../../components/body/tracking/AudienceTrackingDetail";
import { setAlertCode } from "../../../redux/reducer/main";

export default connect(
  state => ({
    getShowAnonymous: state.audienceTracking.showAnonymous,
    getIncludeOnlyOnePage: state.audienceTracking.includeOnlyOnePage
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAlertCode(alertCode))
  })
)(AudienceTrackingDetail);
