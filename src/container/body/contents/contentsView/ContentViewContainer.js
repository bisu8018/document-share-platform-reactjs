import { connect } from "react-redux";
import ContentView from "../../../../components/body/contents/contentsView/ContentView";
import { setAction } from "../../../../redux/reducer/main";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getAway: state.header.away
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode))
  })
)(ContentView);
