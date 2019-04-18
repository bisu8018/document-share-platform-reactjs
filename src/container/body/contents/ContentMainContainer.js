import { connect } from "react-redux";
import ContentMain from "../../../components/body/contents/ContentMain";

const mapStateToProps = state => ({
  getTagList: state.main.tagList,
  getWeb3Apis: state.main.web3Apis,
  getDrizzle: state.main.drizzleApis,
  });

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentMain);