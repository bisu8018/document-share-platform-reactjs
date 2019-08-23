import React from "react";
import { psString } from "../../../config/localization";
import MainRepository from "../../../redux/MainRepository";
import { FadingCircle } from "better-react-spinkit";
import history from "apis/history/history";
import common_view from "../../../common/common_view";
import common from "../../../common/common";


class DeleteDocumentModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classicModal: false,
      closeFlag: false,
      loading: false
    };
  }


  // state 제거
  clearState = () =>
    this.setState({
      classicModal: false,
      closeFlag: false,
      loading: false
    });


  // 모달 숨기기 클래스 추가
  setCloseFlag = () =>
    new Promise(resolve =>
      this.setState({ closeFlag: true }, () => resolve()));


  // 모달 open 관리
  handleClickOpen = (modal) => {
    const x = [];
    x[modal] = true;
    this.setState(x);
    common_view.setBodyStyleLock();
  };


  // 모달 취소버튼 클릭 관리
  handleClickClose = modal =>
    this.setCloseFlag()
      .then(() => common.delay(200))
      .then(() => common_view.setBodyStyleUnlock())
      .then(() => this.handleClose(modal))
      .then(() => this.clearState());


  // 모달 close 관리
  handleClose = (modal) => {
    const x = [];
    x[modal] = false;
    this.setState(x);
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
  handleDeleteAfter = () => {
    const { setAlertCode, documentData } = this.props;

    if (common_view.getPaths().length > 2 && common_view.getPaths()[2] === documentData.seoTitle) {
      history.push("/");
      setAlertCode(2076);
    } else document.location.reload();
  };


  render() {
    const { classicModal, loading, closeFlag } = this.state;

    return (
      <div>
        <div className="option-table-btn " onClick={() => this.handleClickOpen("classicModal")}>
          {psString("common-modal-delete")}
        </div>

        {classicModal &&
        <div className="custom-modal-container">
          <div className="custom-modal-wrapper"/>
          <div className={"custom-modal " + (closeFlag ? "custom-hide" : "")}>


            <div className="custom-modal-title">
              <i className="material-icons modal-close-btn"
                 onClick={() => this.handleClickClose("classicModal")}>close</i>
              <h3>{psString("delete-modal-title")}</h3>
            </div>


            <div className="custom-modal-content">
              <div className="">{psString("delete-modal-desc")}</div>
            </div>


            <div className="custom-modal-footer">
              <div onClick={() => this.handleClickClose("classicModal")} className="cancel-btn">
                {psString("common-modal-cancel")}
              </div>
              <div onClick={() => this.handleDelete()} className={"ok-btn "}>
                {loading &&
                <div className="loading-btn-wrapper"><FadingCircle color="#3681fe" size={17}/></div>}
                {psString("common-modal-delete")}
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    );
  }
}

export default DeleteDocumentModal;
