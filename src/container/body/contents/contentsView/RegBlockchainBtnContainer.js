import { connect } from "react-redux";
import RegBlockchainBtn from "../../../../components/body/contents/contentsView/RegBlockchainBtn";

const mapStateToProps = state => ({
  getWeb3Apis: state.main.web3Apis,
  getDrizzle: state.main.drizzleApis,
  getIsDocumentExist: state.contentView.isDocumentExist,
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegBlockchainBtn);