import { connect } from "react-redux";
import ContentViewCarousel from "../../../../components/body/contents/contentsView/ContentViewCarousel";
import { setMyInfo } from "../../../../redux/reducer/main";

export default connect(
  state => ({
    getMyInfo: state.main.myInfo,
    getTempEmail: state.emailModal.tempEmail
  }),
  dispatch => ({
    setMyInfo: (myInfo: any) => dispatch(setMyInfo(myInfo))
  })
)(ContentViewCarousel);
