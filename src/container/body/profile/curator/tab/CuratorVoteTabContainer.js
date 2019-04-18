import { connect } from "react-redux";
import CuratorVoteTab from "../../../../../components/body/profile/curator/tab/CuratorVoteTab";

const mapStateToProps = state => ({
  getWeb3Apis: state.main.web3Apis
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CuratorVoteTab);