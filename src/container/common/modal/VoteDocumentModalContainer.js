import { connect } from "react-redux";
import VoteDocument from "../../../components/common/modal/VoteDocumentModal";
import { setAlertCode } from "../../../redux/reducer/main";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getMyInfo: state.main.myInfo
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => {
      dispatch(setAlertCode(alertCode));
    },
  })
)(VoteDocument);
