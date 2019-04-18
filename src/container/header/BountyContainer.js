import { connect } from "react-redux";
import Bounty from "../../components/header/Bounty";

const mapStateToProps = state => ({
  getWeb3Apis: state.main.web3Apis,
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bounty);