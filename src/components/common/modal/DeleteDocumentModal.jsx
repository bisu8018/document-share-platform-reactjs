import React from "react";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
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
    const { setAlertCode, documentData } = this.props;
    let data = {
      isDeleted: true,
      documentId: documentData.documentId
    };
    MainRepository.Document.deleteDocument(data).then(() => {
      this.handleClose("classicModal");
      //document.location.reload();
    }, () => {
      setAlertCode(2073);
    });
  };


  render() {
    const { classicModal } = this.state;

    return (
      <div>
        <div className="option-table-btn " onClick={() => this.handleClickOpen("classicModal")}>
          {psString("common-modal-delete")}
        </div>

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
              {psString("common-modal-delete")}
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DeleteDocumentModal;
