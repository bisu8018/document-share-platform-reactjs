import { connect } from "react-redux";
import RegBlockchainBtn from "../../../../components/body/contents/contentsView/RegBlockchainBtn";
import { setAction } from "../../../../redux/reducer/main";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getMyInfo: state.main.myInfo,
    getIsMobile: state.main.isMobile,
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode))
  })
)(RegBlockchainBtn);
