import { connect } from "react-redux";
import AudienceTrackingDetail from "../../../components/body/tracking/AudienceTrackingDetail";

export default connect(
  state => ({
    getShowAnonymous: state.audienceTracking.showAnonymous,
    getIncludeOnlyOnePage: state.audienceTracking.includeOnlyOnePage,
  }),
 // dispatch => ({}),
)(AudienceTrackingDetail);