import { connect } from "react-redux";
import ContentMain from "../../../components/body/contents/ContentMain";

export default connect(
  state => ({
    getTagList: state.main.tagList,
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
    getIsMobile: state.main.isMobile
  }),
  dispatch => ({})
)(ContentMain);