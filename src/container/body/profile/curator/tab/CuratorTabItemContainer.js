import { connect } from "react-redux";
import CuratorTabItem from "../../../../../components/body/profile/curator/tab/CuratorTabItem";

const mapStateToProps = state => ({
  getWeb3Apis: state.main.web3Apis
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CuratorTabItem);