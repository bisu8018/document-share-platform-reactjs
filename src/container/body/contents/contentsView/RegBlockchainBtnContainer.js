import { connect } from "react-redux";
import RegBlockchainBtn from "../../../../components/body/contents/contentsView/RegBlockchainBtn";
import { setDrizzleApis } from "../../../../redux/reducer/main";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getMyInfo: state.main.myInfo
  }),
  dispatch => ({
    setDrizzleApis: () => {
      dispatch(setDrizzleApis());
    },
  })
)(RegBlockchainBtn);
