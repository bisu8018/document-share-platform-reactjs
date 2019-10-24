import React from "react";
import history from "apis/history/history";
import MainRepository from "../../../redux/MainRepository";
import { Circle } from "better-react-spinkit";
import { psString } from "../../../config/localization";
import common_view from "../../../common/common_view";
import common from "../../../common/common";
import DropZoneContainer from "../../../container/common/DropZoneContainer";
import Tooltip from "@material-ui/core/Tooltip";


class UploadDocumentModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      closeFlag: false,
      percentage: 0,
      title: "",
      titleError: "",
      fileInfo: {
        file: null,
        size: -1,
        ext: null,
        owner: null,
        title: null,
        filename: null
      },
      fileInfoError: "",  // 파일 에러 정보
      classicModal: false,    // 모달
      classicModalSub: false,    // 모달2
      identifier: null,
      desc: ""
    };
  }


  // 초기화
  init = () => {
    const { getMyInfo } = this.props;

    this.setState({ identifier: getMyInfo.username || getMyInfo.email }, () => {
      if (getMyInfo.privateDocumentCount > 0) this.props.setAlertCode(2074);
      common_view.setBodyStyleLock();
    });
  };


  // 문서 등록 API
  registerDocument = () => {
    const { getMyInfo, setAlertCode, setMyInfo } = this.props;
    const { title, fileInfo, desc } = this.state;

    return new Promise((resolve, reject) => {
      MainRepository.Document.registerDocument({
        fileInfo: fileInfo,
        userInfo: MainRepository.Account.getMyInfo(),
        ethAccount: getMyInfo.ethAccount,
        title: title,
        desc: desc,
        tags: [],
        useTracking: false,
        forceTracking: false,
        isDownload: false,
        cc: []
      }, this.handleProgress, result => {
        if (result.code && result.code === "EXCEEDEDLIMIT") {
          let tmpMyInfo = getMyInfo;
          tmpMyInfo.privateDocumentCount = 5;
          setMyInfo(tmpMyInfo);
          setAlertCode(2072);
          reject();
        }
        resolve(result);
      }, err => reject(err));
    });
  };


  // input form 초기화
  clearForm = () => {
    if (!document.getElementById("docTitle")) return true;

    document.getElementById("docTitle").value = null;
    document.getElementById("docDesc").value = null;
    return Promise.resolve();
  };


  // 모달 숨기기 클래스 추가
  setCloseFlag = () => new Promise(resolve =>
    this.setState({ closeFlag: true }, () => resolve()));


  // 진행도 모달 닫기
  handleProcessModalClose = () => {
    document.getElementById("progressModal").style.display = "none"; //진행도 모달 닫기
    document.getElementById("progressWrapper").style.display = "none"; //진행도 모달 wrapper 닫기
  };


  // 진행도 모달 열기
  handleProcessModalOpen = () => {
    document.getElementById("progressModal").style.display = "block";   //진행도 모달 열기
    document.getElementById("progressWrapper").style.display = "block";   //진행도 wrapper 모달 열기
  };


  //업로드 함수
  handleUpload = () => {
    const { setAlertCode, setModal } = this.props;
    const { identifier } = this.state;

    this.handleProcessModalOpen();

    // 문서 등록 API
    this.registerDocument().then(res => {
      // 업로드 성공 모달 전환
      setModal("uploadComplete", {
        privateDocumentCount: res.privateDocumentCount || 0,
        identifier: identifier
      });
    }).catch(err => {
      this.handleProcessModalClose();
      console.error(err);
      setAlertCode(2071);
      setModal(null);
    });
  };


  // 포스트 버튼 관리
  handleAddPostBtn = () => {
    history.push("/ca");
    this.props.setModal(null);
  };


  // 업로드 버튼 관리, input 값 유효성 검사
  handleUploadBtn = () => {
    if (!this.validateTitle() || !this.validateFile()) return false;
    this.handleUpload();
  };


  // 파일 업로드 로딩 바 핸들 함수
  handleProgress = e => {
    let percent = Math.round((e.loaded / e.total) * 100);
    if (percent !== null) this.setState({ percentage: percent });
  };


  //file input 등록/변경 시
  handleFileChange = e => {
    const file = e[0];
    if (!file) return false;
    let filename = file.name,
      fileSize = file.size,
      ext = filename.substring(filename.lastIndexOf(".") + 1, filename.length).toLowerCase();

    this.setState({
      fileInfo: {
        file: file,
        size: fileSize,
        ext: ext,
        filename: filename
      }
    }, () => {
      this.validateFile();
    });
  };


  // 모달 취소버튼 클릭 관리
  handleClickClose = () =>
    this.setCloseFlag()
      .then(() => common.delay(200))
      .then(() => common_view.setBodyStyleUnlock())
      .then(() => this.clearForm())
      .then(() => this.props.setModal(null));


  // 제목 변경 관리
  handleTitleChange = e => this.setState({ title: e.target.value }, () => this.validateTitle());


  // 설명 수정 관리
  handleDescChange = e => this.setState({ desc: e.target.value });


  //제목 유효성 체크
  validateTitle = () => {
    const { title } = this.state;
    this.setState({ titleError: title.length > 0 ? "" : psString("edit-doc-error-1") });
    return title.length > 0;
  };


  //파일 유효성 체크
  validateFile = () => {
    const { fileInfo } = this.state;
    this.setState({
      fileInfoError:
        fileInfo.title === null || fileInfo.filename === null ? psString("upload-doc-check") : ""
    });
    return !(fileInfo.title === null || fileInfo.filename === null);
  };


  componentWillMount(): void {
    this.init();
  }


  render() {
    const { percentage, titleError, fileInfoError, closeFlag } = this.state;

    if (!MainRepository.Account.isAuthenticated()) return MainRepository.Account.login();

    return (
      <div className="custom-modal-container">
        <div className="custom-modal-wrapper"/>
        <div className={"custom-modal " + (closeFlag ? "custom-hide" : "")}>


          <div className="custom-modal-title">
            <i className="material-icons modal-close-btn"
               onClick={() => this.handleClickClose("classicModal")}>close</i>
            <h3>{psString("upload-doc-subj")}</h3>
          </div>


          <div className="custom-modal-content tal">
            <input type="text" placeholder={psString("common-modal-title")} id="docTitle"
                   className={"custom-input " + (titleError.length > 0 ? "custom-input-warning" : "")}
                   onChange={(e) => this.handleTitleChange(e)}/>
            <span>{titleError}</span>

            <DropZoneContainer handleFileChange={file => this.handleFileChange(file)} fileInfoError={fileInfoError}/>
            <span>{fileInfoError}</span>

            <textarea id="docDesc"
                      placeholder={psString("common-modal-description")}
                      className="custom-textarea mt-4"
                      onChange={(e) => this.handleDescChange(e)}/>
          </div>

          <div className="custom-modal-footer">
            <Tooltip title={psString("content-add-post-add")} placement="bottom">
              <div onClick={() => this.handleAddPostBtn()} className="post-add-btn">
                <i className="material-icons mr-2">post_add</i>
              </div>
            </Tooltip>
            <div onClick={() => this.handleClickClose("classicModal")}
                 className="cancel-btn ">{psString("common-modal-cancel")}</div>
            <div onClick={() => this.handleUploadBtn()} className="ok-btn">{psString("common-modal-upload")}</div>
          </div>

          <div className="progress-wrapper" id="progressWrapper"/>
          <div className="progress-modal" id="progressModal">
            <div className="progress-modal-second">
              <div className="progress-percent">{percentage}%</div>
              <Circle size={100} color={"#ffffff"}/>
            </div>
          </div>
        </div>
      </div>
    );
  };
}


export default UploadDocumentModal;
