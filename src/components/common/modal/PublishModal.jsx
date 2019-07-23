import React from "react";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Tooltip from "@material-ui/core/Tooltip";
import { psString } from "../../../config/localization";
import DialogActions from "@material-ui/core/DialogActions";
import MainRepository from "../../../redux/MainRepository";


function Transition(props) {
  return <Slide direction="down" {...props} />;
}


class PublishModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classicModal: false
    };
  }


  // state 제거
  clearState = () => {
    this.setState({
      classicModal: false
    });
  };


  getBalance = () => {
    const { getWeb3Apis, getMyInfo } = this.props;
    return new Promise((resolve) => {
      getWeb3Apis.getBalance(getMyInfo.ethAccount, res => {
        resolve(res);
      });
    });
  };


  // 모달 open 관리
  handleClickOpen = (modal) => {
    const x = [];
    x[modal] = true;
    this.setState(x);
  };


  // 모달 close 관리
  handleClose = (modal) => {
    const x = [];
    x[modal] = false;
    this.setState(x);
    this.clearState();
  };


  // publish 관리
  handlePublish = async () => {
    const { documentData, getDrizzle, getMyInfo, setAlertCode } = this.props;
    let ethAccount = getMyInfo.ethAccount;
    let data = {
      isPublic: true,
      documentId: documentData.documentId
    };
    MainRepository.Document.publishDocument(data).then(() => {
      if (getDrizzle && ethAccount) {
        this.getBalance().then(res => {
          if (res && res > 0) {
            getDrizzle.registerDocumentToSmartContract(documentData.documentId);
            this.handleClose("classicModal");
            document.location.reload();
          } else {
            setAlertCode(2053);
            setTimeout(() => {
              this.handleClose("classicModal");
              document.location.reload();
            }, 3000);
          }
        });
      } else {
        this.handleClose("classicModal");
        document.location.reload();
      }
    });
  };


  render() {
    const { classicModal } = this.state;
    const { getDrizzle, getMyInfo, type, getIsMobile } = this.props;

    let ethAccount = getMyInfo.ethAccount;

    return (
      <span>
         <Tooltip title={psString("tooltip-publish")} placement="bottom">
           {type === "tabItem" ?
             <div className={"claim-btn " + (getIsMobile ? " w-100" : "")} onClick={() => this.handleClickOpen("classicModal")}>
               {psString("common-modal-publish")}
             </div>
             :
             <div className="viewer-btn mb-1" onClick={() => this.handleClickOpen("classicModal")}>
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
            <div className="">{psString("publish-modal-desc-" + (!getDrizzle && ethAccount ? "1" : "2"))}</div>
          </DialogContent>


          <DialogActions className="modal-footer">
            <div onClick={() => this.handleClose("classicModal")} className="cancel-btn">
              {psString("common-modal-cancel")}
            </div>
            <div onClick={() => this.handlePublish()} className={"ok-btn "}>
                {psString(getDrizzle && ethAccount ? "publish-modal-confirm-btn" : "common-modal-confirm")}
            </div>
          </DialogActions>
        </Dialog>
      </span>
    );
  }
}

export default PublishModal;
