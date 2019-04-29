import { connect } from "react-redux";
import CuratorVoteTab from "../../../../components/body/profile/curator/CuratorVoteTab";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis
  }),
  dispatch => ({})
)(CuratorVoteTab);