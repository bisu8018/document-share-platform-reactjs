import { connect } from "react-redux";
import ContentList from "../../../components/body/contents/ContentList";
import { setAction } from "../../../redux/reducer/main";


export default connect(
  state => ({
    getTagList: state.main.tagList,
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
    getIsMobile: state.main.isMobile,
    getDocumentList: state.main.documentList,
  }),
  dispatch => ({
    setTagList: (tagList: []) => dispatch(setAction.tagList(tagList)),
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode))
  })
)(ContentList);
