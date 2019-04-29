import { connect } from "react-redux";
import ContentListItem from "../../../components/body/contents/ContentListItem";
import { setAuthorDailyRewardPool } from "../../../redux/reducer/main";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
  }),
  dispatch => ({
    setAuthorDailyRewardPool: (authorRewardPool: any) => {
      dispatch(setAuthorDailyRewardPool(authorRewardPool));
    },
  })
)(ContentListItem);