import { connect } from "react-redux";
import CuratorUserActiveVote from "../../../../components/body/profile/curator/CuratorUserActiveVote";

const mapStateToProps = state => ({
  getWeb3Apis: state.main.web3Apis
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CuratorUserActiveVote);