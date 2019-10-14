import React from "react";
import { psString } from "../../../../config/localization";
import MainRepository from "../../../../redux/MainRepository";
import ContentAddModalContainer from "../../../../container/common/modal/ContentAddModalContainer";
import DropZoneContainer from "../../../../container/common/DropZoneContainer";
import ContentEditorContainer from "../../../../container/body/contents/contentsAdd/ContentEditorContainer";


class ContentAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
      identifier: null,
      fileInfoError: "",  // 파일 에러 정보
      desc: "",
      firstModalOpen: false,
      init: false
    };
  }


  // 초기화
  init = () => {
    const { getMyInfo } = this.props;

    if (!MainRepository.Account.isAuthenticated()) {
      MainRepository.Account.login();
    } else {
      this.setState({ init: true, identifier: getMyInfo.username || getMyInfo.email }, () => {
        if (getMyInfo.privateDocumentCount > 0) this.props.setAlertCode(2074);
        document.getElementById("docTitle").focus();
      });
    }
  };


  // 모달 종료
  closeModal = () => this.setState({ firstModalOpen: false });


  // GET 포스팅 내용
  getDesc = content => this.setState({ desc: content });


  // 파일 업로드 관리
  handleFileUpload = () => document.getElementById("docFile").click();


  // 업로드 버튼 관리, input 값 유효성 검사
  handlePublishBtn = () => {
    if (!this.validateFile() || !this.validateTitle()) return false;
    this.setState({ firstModalOpen: true });
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


  // 프라이빗 문서 보유수 체크
  checkPrivateDoc = res =>
    this.setState({ privateDocCount: res.privateDocumentCount }, () => {
      this.setState({ classicModalSub: true });  //두번째 모달 열기
    });


  componentWillMount(): void {
    this.init();
  }


  render() {
    const { titleError, fileInfoError, identifier, fileInfo, title, desc, firstModalOpen, init } = this.state;

    if (!init) return <div/>;

    return (
      <div className="row container container-add pt-4 mb-5">

        <div className="col-12 content-add-dropzone-wrapper">
          <DropZoneContainer handleFileChange={file => this.handleFileChange(file)} fileInfoError={fileInfoError}/>
          <span>{fileInfoError}</span>
        </div>


        <div className="col-12 mt-4">
          <input type="text" autoComplete="off" placeholder={psString("common-modal-title")} id="docTitle"
                 className={"custom-input-content-add-title " + (titleError.length > 0 ? "custom-input-warning" : "")}
                 onChange={e => this.handleTitleChange(e)}/>
          <span>{titleError}</span>
        </div>


        {(title.length > 0 || desc.length > 0) &&
        <div className="col-12 mb-5">
          <ContentEditorContainer getDesc={content => this.getDesc(content)}/>
        </div>}


        <div onClick={() => this.handlePublishBtn()} id="contentAddPublish" className="d-none"/>


        {firstModalOpen &&
        <ContentAddModalContainer closeModal={() => this.closeModal()} identifier={identifier} fileInfo={fileInfo}
                                  title={title} desc={desc}/>}
      </div>
    );
  }
}

export default ContentAdd;
