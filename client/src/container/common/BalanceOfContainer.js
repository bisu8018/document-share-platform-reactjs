import { connect } from "react-redux";
import BalanceOf from "../../components/common/amount/BalanceOf";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis
  }),
  dispatch => ({})
)(BalanceOf);