import { connect } from "react-redux";
import CreatorSummary from "../../../../components/body/profile/creator/CreatorSummary";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
    getCuratorDailyRewardPool: state.main.curatorDailyRewardPool
  }),
  dispatch => ({})
)(CreatorSummary);