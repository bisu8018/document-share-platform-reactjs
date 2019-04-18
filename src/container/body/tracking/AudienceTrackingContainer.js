import { connect } from "react-redux";
import AudienceTracking from "../../../components/body/tracking/AudienceTracking";

const mapStateToProps = state => ({
  getWeb3Apis: state.main.web3Apis,
  getDrizzle: state.main.drizzleApis,
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AudienceTracking);