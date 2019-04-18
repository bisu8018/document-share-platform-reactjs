import { connect } from "react-redux";
import CuratorClaim from "../../../../components/body/profile/curator/CuratorClaim";

const mapStateToProps = state => ({
  getWeb3Apis: state.main.web3Apis,
  getDrizzle: state.main.drizzleApis,
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CuratorClaim);