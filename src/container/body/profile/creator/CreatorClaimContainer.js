import { connect } from "react-redux";
import CreatorClaim from "../../../../components/body/profile/creator/CreatorClaim";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getMyInfo: state.main.myInfo,
  }),
  dispatch => ({})
)(CreatorClaim);