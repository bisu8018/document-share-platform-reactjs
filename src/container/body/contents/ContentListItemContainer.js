import { connect } from "react-redux";
import ContentListItem from "../../../components/body/contents/ContentListItem";
import { setAction } from "../../../redux/reducer/main";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
    getIsMobile: state.main.isMobile,
  }),
  dispatch => ({
    setAuthorDailyRewardPool: (authorRewardPool: any) => dispatch(setAction.authorDailyRewardPool(authorRewardPool))
  })
)(ContentListItem);
