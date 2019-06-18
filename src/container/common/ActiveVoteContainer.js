import { connect } from "react-redux";
import ActiveVote from "../../components/common/amount/ActiveVote";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis
  }),
  dispatch => ({})
)(ActiveVote);