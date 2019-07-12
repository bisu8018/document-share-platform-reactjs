import { connect } from "react-redux";
import VoteDocument from "../../components/common/modal/VoteDocumentModal";
import { setAlertCode, setDrizzleApis } from "../../redux/reducer/main";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getMyInfo: state.main.myInfo,
    getIsDocumentExist: state.contentView.isDocumentExist
  }),
  dispatch => ({
    setDrizzleApis: () => {
      dispatch(setDrizzleApis());
    },
    setAlertCode: (alertCode: number) => {
      dispatch(setAlertCode(alertCode));
    },
  })
)(VoteDocument);
