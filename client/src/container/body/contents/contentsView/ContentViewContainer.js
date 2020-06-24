import { connect } from "react-redux";
import ContentView from "../../../../components/body/contents/contentsView/ContentView";
import { setAction } from "../../../../redux/reducer/main";
import { setAction as contentView } from "../../../../redux/reducer/contentView";

export default connect(
  state => ({
    getAway: state.header.away,
    getDocument: state.contentView.document

  }),
  dispatch => ({
    setAlertCode: (alertCode: any) => dispatch(setAction.alertCode(alertCode)),
    setDocument: (document: any) => dispatch(contentView.document(document)),
  })
)(ContentView);
