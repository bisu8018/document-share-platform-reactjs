import { connect } from "react-redux";
import Ads from "../../components/ads/Ads";

export default connect(
  state => ({
    getIsMobile: state.main.isMobile
  }),
  dispatch => ({})
)(Ads);