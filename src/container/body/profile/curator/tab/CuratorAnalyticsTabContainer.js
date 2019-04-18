import { connect } from "react-redux";
import CuratorAnalyticsTab from "../../../../../components/body/profile/curator/tab/CuratorAnalyticsTab";

const mapStateToProps = state => ({
  getWeb3Apis: state.main.web3Apis
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CuratorAnalyticsTab);