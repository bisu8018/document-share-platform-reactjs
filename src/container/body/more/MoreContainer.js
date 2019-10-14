import { connect } from "react-redux";
import More from "../../../components/body/more/More";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis
  }),
  dispatch => ({})
)(More);
