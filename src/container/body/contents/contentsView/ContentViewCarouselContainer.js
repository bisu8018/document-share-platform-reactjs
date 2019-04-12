import { connect } from "react-redux";
import ContentViewCarousel from "../../../../components/body/contents/contentsView/ContentViewCarousel";

const mapStateToProps = state => ({
  getMyInfo: state.main.myInfo
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentViewCarousel);