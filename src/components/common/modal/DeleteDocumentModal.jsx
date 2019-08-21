import React from "react";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { psString } from "../../../config/localization";
import DialogActions from "@material-ui/core/DialogActions";
import MainRepository from "../../../redux/MainRepository";
import { FadingCircle } from "better-react-spinkit";
import history from "apis/history/history";
import common_view from "../../../common/common_view";


const Transition = props => <Slide direction="down" {...props} />;


class DeleteDocumentModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classicModal: false,
      loading: false
    };
  }


  // state 제거
  clearState = () => {
    this.setState({
      classicModal: false,
      loading: false
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

    this.setState({ loading: true });
    MainRepository.Document.deleteDocument({ isDeleted: true, documentId: documentData.documentId }).then(() => {
      this.handleClose("classicModal");
      this.handleDeleteAfter();
    }).catch(() => this.setState({ loading: false }, () => setAlertCode(2073)));
  };


  // 삭제후 관리
  handleDeleteAfter = (seoTitle) => {
    const { setAlertCode, documentData } = this.props;

    if (common_view.getPaths().length > 2 && common_view.getPaths()[2] === documentData.seoTitle) {
      history.push("/");
      setAlertCode(2076);
    }
    else document.location.reload();
  };


  render() {
    const { classicModal, loading } = this.state;

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
              {loading &&
              <div className="loading-btn-wrapper"><FadingCircle color="#3681fe" size={17}/></div>}
              {psString("common-modal-delete")}
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DeleteDocumentModal;
