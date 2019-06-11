import { connect } from "react-redux";
import ContentList from "../../../components/body/contents/ContentList";
import { setTagList } from "../../../redux/reducer/main";


export default connect(
  state => ({
    getTagList: state.main.tagList,
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
    getIsMobile: state.main.isMobile,
  }),
  dispatch => ({
    setTagList: (tagList: []) => dispatch(setTagList(tagList))
  })
)(ContentList);