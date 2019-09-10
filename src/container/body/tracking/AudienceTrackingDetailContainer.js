import { connect } from "react-redux";
import AudienceTrackingDetail from "../../../components/body/tracking/AudienceTrackingDetail";
import { setAction } from "../../../redux/reducer/main";

export default connect(
  state => ({
    getShowAnonymous: state.audienceTracking.showAnonymous,
    getIncludeOnlyOnePage: state.audienceTracking.includeOnlyOnePage
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode))
  })
)(AudienceTrackingDetail);
