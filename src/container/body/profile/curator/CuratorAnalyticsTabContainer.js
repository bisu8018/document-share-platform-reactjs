import { connect } from "react-redux";
import CuratorAnalyticsTab from "../../../../components/body/profile/curator/CuratorAnalyticsTab";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis
  }),
  dispatch => ({})
)(CuratorAnalyticsTab);