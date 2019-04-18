import { connect } from "react-redux";
import VoteDocument from "../../components/modal/VoteDocumentModal";

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
)(VoteDocument);