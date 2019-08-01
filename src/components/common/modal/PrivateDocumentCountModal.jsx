import React from "react";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import history from "apis/history/history";
import { psString } from "../../../config/localization";
import DialogActions from "@material-ui/core/DialogActions";
import common from "../../../config/common";
import MainRepository from "../../../redux/MainRepository";


const Transition = props => <Slide direction="down" {...props} />;


class PrivateDocumentCountModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classicModal: false,
      username: null
    };
  }


  // state 제거
  clearState = () => this.setState({ classicModal: false });


  // 모달 open 버튼 클릭 관리
  handleClickOpen = (modal) => {
    const { getMyInfo } = this.props;

    let username = getMyInfo.username;
    let _username = username ? username : getMyInfo.ethAccount;
    this.setState({ username: _username }, () => {
      this.handleOpen(modal);
    });
  };


  // 모달 open 관리
  handleOpen = (modal) => {
    if (!MainRepository.Account.isAuthenticated()) return MainRepository.Account.login();
    else {
      const x = [];
      x[modal] = true;
      this.setState(x);
    }
  };


  // 모달 close 관리
  handleClose = (modal) => {
    const x = [];
    x[modal] = false;
    this.setState(x);
    this.clearState();
  };


  // 링크 이동 관리
  handleLinkBtn = (modal) => {
    this.handleClose(modal);
    history.push("/" + this.props.getMyInfo.username);
  };


  render() {
    const { classicModal, username } = this.state;
    const { type } = this.props;

    return (
      <span>
         <div className="upload-btn d-none d-sm-flex" id="uploadBtn"
              onClick={() => this.handleClickOpen("classicModal")}>
          {psString("common-modal-upload")}
        </div>
        <div className="mobile-upload-btn d-sm-none d-inline-block"
             onClick={() => this.handleClickOpen("classicModal")}/>


        {type && type === "menu" &&
        <span className="d-inline-block d-sm-none"
              onClick={() => this.handleClickOpen("classicModal")}>{psString("common-modal-upload")}</span>
        }


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
          <i className="material-icons modal-close-btn"
             onClick={() => this.handleClose("classicModalSub")}>close</i>
          <h3>{psString("private-doc-modal-subj")}</h3>
        </DialogTitle>

        <DialogContent id="classic-modal-slide-description ">
          <div className="">{psString("private-doc-modal-desc")}</div>
        </DialogContent>

        <DialogActions className="modal-footer">
          <div onClick={() => this.handleClose()} className="ok-btn">{psString("common-modal-confirm")}</div>
          {username !== common.getPath() &&
          <div onClick={() => this.handleLinkBtn()} className="ok-btn">{psString("private-doc-modal-btn")}</div>
          }
        </DialogActions>
      </Dialog>
     </span>
    );
  }
}

export default PrivateDocumentCountModal;
