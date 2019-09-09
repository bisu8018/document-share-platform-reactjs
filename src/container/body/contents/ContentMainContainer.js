import { connect } from "react-redux";
import ContentMain from "../../../components/body/contents/ContentMain";
import { setAlertCode } from "../../../redux/reducer/main";

export default connect(
  state => ({
    getTagList: state.main.tagList,
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
    getIsMobile: state.main.isMobile
  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAlertCode(alertCode)),
  })
)(ContentMain);
