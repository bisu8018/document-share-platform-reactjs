import { connect } from "react-redux";
import AuthorClaim from "../../../../components/body/profile/author/AuthorClaim";

const mapStateToProps = state => ({
  getWeb3Apis: state.main.web3Apis,
  getDrizzle: state.main.drizzleApis,
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorClaim);