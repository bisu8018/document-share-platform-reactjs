import { connect } from "react-redux";
import AuthorSummary from "../../../../components/body/profile/author/AuthorSummary";

const mapStateToProps = state => ({
  getWeb3Apis: state.main.web3Apis
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorSummary);