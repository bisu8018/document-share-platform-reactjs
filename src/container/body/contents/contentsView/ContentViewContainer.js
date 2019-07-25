import { connect } from "react-redux";
import ContentView from "../../../../components/body/contents/contentsView/ContentView";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis
  }),
  dispatch => ({
  })
)(ContentView);
