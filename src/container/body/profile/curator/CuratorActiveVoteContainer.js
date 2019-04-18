import { connect } from "react-redux";
import CuratorActiveVote from "../../../../components/body/profile/curator/CuratorActiveVote";

const mapStateToProps = state => ({
  getWeb3Apis: state.main.web3Apis
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CuratorActiveVote);