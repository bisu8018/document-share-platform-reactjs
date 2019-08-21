import React from "react";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Tooltip from "@material-ui/core/Tooltip";
import { psString } from "../../../config/localization";
import DialogActions from "@material-ui/core/DialogActions";
import MainRepository from "../../../redux/MainRepository";
import { FadingCircle } from "better-react-spinkit";


const Transition = props => <Slide direction="down" {...props} />;

class PublishModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classicModal: false,
      registerLoading: false
    };
  }


  // state 제거
  clearState = () => {
    this.setState({
      classicModal: false,
      registerLoading: false
    });
  };


  // 잔액 GET
  getBalance = () => {
    const { getWeb3Apis, getMyInfo } = this.props;
    return new Promise((resolve) => getWeb3Apis.getBalance(getMyInfo.ethAccount, res => resolve(res)));
  };


  //블록체인 등록
  registerOnChain = () => {
    const { afterPublish, setAlertCode } = this.props;

    return new Promise((resolve, reject) => {
      this.getBalance().then(res => {
        if (res && res > 0) resolve(afterPublish());
        else reject(setAlertCode(2053));
      });
    });
  };


  // 모달 open 관리
  handleOpen = modal => {
    const x = [];
    x[modal] = true;
    this.setState(x);
  };


  // 모달 close 관리
  handleClose = modal => {
    const x = [];
    x[modal] = false;
    this.setState(x);
    this.clearState();
  };


  // 출판/등록 버튼 클릭 관리
  handleClickRegister = () => {
    this.setState({ registerLoading: true }, () => {

      // 문서 출판
      this.handlePublish()
      // 체인 등록 후처리
        .then(() => this.handleClose("classicModal"))
        // 체인 등록
        .then(() => this.registerOnChain());
    });
  };


  // 출판 버튼 클릭 관리
  handleClickPublish = () =>
    this.setState({ registerLoading: true },
      () => this.handlePublish().then(() => document.location.reload()));


  // publish 관리
  handlePublish = () => MainRepository.Document.publishDocument({
    isPublic: true,
    documentId: this.props.documentData.documentId
  });


  render() {
    const { classicModal, registerLoading } = this.state;
    const { getDrizzle, getMyInfo, type, getIsMobile } = this.props;

    let drizzleFlag = getDrizzle && getDrizzle.getReaderAccount() === getMyInfo.ethAccount;

    return (
      <span>
         <Tooltip title={psString("tooltip-publish")} placement="bottom">
           {type === "tabItem" ?
             <div className={"claim-btn " + (getIsMobile ? " w-100" : "")}
                  onClick={() => this.handleOpen("classicModal")}>
               {psString("common-modal-publish")}
             </div>
             :
             <div className="viewer-btn mb-1" onClick={() => this.handleOpen("classicModal")}>
               <i className="material-icons mr-3">publish</i>
               {psString("common-modal-publish")}
             </div>
           }
         </Tooltip>

        <Dialog
          className="modal-width"
          fullWidth={true}
          open={classicModal}
          TransitionComponent={Transition}
          keepMounted
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description">


          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography>
            <i className="material-icons modal-close-btn" onClick={() => this.handleClose("classicModal")}>close</i>
            <h3>{psString("publish-modal-title")}</h3>
          </DialogTitle>


          <DialogContent id="classic-modal-slide-description ">
            <div
              className="">{psString("publish-modal-desc-" + (!drizzleFlag ? "1" : "2"))}</div>
          </DialogContent>


          <DialogActions className="modal-footer">
            <div onClick={() => this.handleClose("classicModal")} className="cancel-btn">
                {psString("common-modal-cancel")}</div>
            {drizzleFlag ?
              <div onClick={() => this.handleClickRegister()}
                   className={"ok-btn " + (registerLoading ? "btn-disabled" : "")}>
                {registerLoading &&
                <div className="loading-btn-wrapper"><FadingCircle color="#3681fe" size={17}/></div>}
                {psString("publish-modal-confirm-btn")}
              </div>
              :
              <div onClick={() => this.handleClickPublish()}
                   className={"ok-btn " + (registerLoading ? "btn-disabled" : "")}>
                {registerLoading &&
                <div className="loading-btn-wrapper"><FadingCircle color="#3681fe" size={17}/></div>}
                {psString("publish-modal-publish-btn")}
              </div>
            }
          </DialogActions>
        </Dialog>
      </span>
    );
  }
}

export default PublishModal;
