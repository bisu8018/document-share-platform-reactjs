import { connect } from "react-redux";
import DocumentCard from "../../components/common/DocumentCard";

export default connect(
  state => ({
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
  }),
  dispatch => ({ })
)(DocumentCard);