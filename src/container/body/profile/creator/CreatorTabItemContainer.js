import { connect } from "react-redux";
import CreatorTabItem from "../../../../components/body/profile/creator/CreatorTabItem";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
  }),
  dispatch => ({})
)(CreatorTabItem);