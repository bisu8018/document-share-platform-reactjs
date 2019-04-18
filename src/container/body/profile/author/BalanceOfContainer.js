import { connect } from "react-redux";
import BalanceOf from "../../../../components/body/profile/author/BalanceOf";

const mapStateToProps = state => ({
  getWeb3Apis: state.main.web3Apis
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BalanceOf);