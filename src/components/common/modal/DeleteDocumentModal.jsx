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


class DeleteDocumentModal extends React.Component {

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


  // delete 관리
  handleDelete = async () => {
    const { setAlertCode } = this.props;
    MainRepository.Document.deleteDocument({ isDelete: true }, () => {
      this.handleClose("classicModal");
      document.location.reload();
    }, () => {
      setAlertCode(2073);
    });
  };


  render() {
    const { classicModal } = this.state;
    const { type } = this.props;

    return (
      <span>
         <Tooltip title={psString("tooltip-delete")} placement="bottom">
                 {type !== "onlyIcon" ?
                   <div className="viewer-btn mb-1 mr-3" onClick={() => this.handleClickOpen("classicModal")}>
                     <i className="material-icons ">delete_outline</i>
                     {psString("common-modal-delete")}
                   </div>
                   :
                   <div className="delete-btn-wrapper ml-1 mr-3" onClick={() => this.handleClickOpen("classicModal")}>
                     <i className="material-icons ">delete</i>
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
            <h3>{psString("delete-modal-title")}</h3>
          </DialogTitle>


          <DialogContent id="classic-modal-slide-description ">
            <div className="">{psString("delete-modal-desc")}</div>
          </DialogContent>


          <DialogActions className="modal-footer">
            <div onClick={() => this.handleClose("classicModal")} className="cancel-btn">
              {psString("common-modal-cancel")}
            </div>
            <div onClick={() => this.handleDelete()} className={"ok-btn "}>
                {psString("common-modal-confirm")}
            </div>
          </DialogActions>
        </Dialog>
      </span>
    );
  }
}

export default DeleteDocumentModal;
