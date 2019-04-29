import { connect } from "react-redux";
import ContentView from "../../../../components/body/contents/contentsView/ContentView";
import { setIsDocumentExist } from "../../../../redux/reducer/contentView";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getDrizzle: state.main.drizzleApis,
    getIsDocumentExist: state.contentView.isDocumentExist,
  }),
  dispatch => ({
    setIsDocumentExist: (isDocumentExist:boolean) => {
      dispatch(setIsDocumentExist(isDocumentExist));
    },
  })
)(ContentView);