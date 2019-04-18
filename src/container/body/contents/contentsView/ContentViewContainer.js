import { connect } from "react-redux";
import ContentView from "../../../../components/body/contents/contentsView/ContentView";
import { setIsDocumentExist } from "../../../../redux/reducer/contentView";

const mapStateToProps = state => ({
  getWeb3Apis: state.main.web3Apis,
  getDrizzle: state.main.drizzleApis,
  getIsDocumentExist: state.contentView.isDocumentExist,
});

const mapDispatchToProps = (dispatch: any) => ({
  setIsDocumentExist: (isDocumentExist:boolean) => {
    dispatch(setIsDocumentExist(isDocumentExist));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentView);