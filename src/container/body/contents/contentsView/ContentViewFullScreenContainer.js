import { connect } from "react-redux";
import ContentViewFullScreen from "../../../../components/body/contents/contentsView/ContentViewFullScreen";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
  }),
  dispatch => ({})
)(ContentViewFullScreen);