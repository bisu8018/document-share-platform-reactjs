import { connect } from "react-redux";
import CreatorSummary from "../../../../components/body/profile/creator/CreatorSummary";
import { setAction as mainAction, setAction } from "../../../../redux/reducer/main";

export default connect(
  state => ({
    getWeb3Apis: state.main.web3Apis,
    getCreatorDailyRewardPool: state.main.authorDailyRewardPool,
    getCuratorDailyRewardPool: state.main.curatorDailyRewardPool,
    getModalData: state.main.modalData,
    getMyInfo: state.main.myInfo
  }),
  dispatch => ({
    setModal: (modalCode: any, modalData: any) => dispatch(setAction.modal(modalCode, modalData)),
    setMyInfo: (myInfo: any) => dispatch(setAction.myInfo(myInfo)),
    setAlertCode: (alertCode: any) => dispatch(mainAction.alertCode(alertCode))
  })
)(CreatorSummary);
