import { connect } from "react-redux";
import ContentList from "../../../components/body/contents/ContentList";


export default connect(
  state => ({
    getTagList: state.main.tagList,
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
  }),
  dispatch => ({})
)(ContentList);