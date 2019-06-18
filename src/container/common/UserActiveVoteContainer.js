import { connect } from "react-redux";
import UserActiveVote from "../../components/common/amount/UserActiveVote";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis
  }),
  dispatch => ({})
)(UserActiveVote);