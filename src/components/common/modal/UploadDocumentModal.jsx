import React from "react";
import AutoSuggest from "react-autosuggest";
import TagsInput from "react-tagsinput";
import MainRepository from "../../../redux/MainRepository";
import { Circle } from "better-react-spinkit";
import { psString } from "../../../config/localization";
import common_view from "../../../common/common_view";
import common from "../../../common/common";


class UploadDocumentModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      closeFlag: false,
      percentage: 0,
      title: "",
      titleError: "",
      tags: [],
      tagError: "",
      fileInfo: {
        file: null,
        size: -1,
        ext: null,
        owner: null,
        title: null,
        filename: null
      },
      fileInfoError: "",  // 파일 에러 정보
      useTracking: false,   // 트래킹 사용 유무
      forceTracking: false,   // 트래킹 강제 사용 유무
      allowDownload: false,   // 다운로드 허용
      classicModal: false,    // 모달
      classicModalSub: false,    // 모달2
      by: false,   //CC License by 사용유무
      nc: false,   //CC License nc 사용유무
      nd: false,   //CC License nd 사용유무
      sa: false,   //CC License sa 사용유무
      moreOptions: false,    // more options show / hide
      identifier: null,
      desc: "",
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
    const { title, fileInfo, tags, desc, useTracking, forceTracking, allowDownload } = this.state;

    return new Promise((resolve, reject) => {
      MainRepository.Document.registerDocument({
        fileInfo: fileInfo,
        userInfo: MainRepository.Account.getMyInfo(),
        ethAccount: getMyInfo.ethAccount,
        title: title,
        desc: desc,
        tags: tags,
        useTracking: useTracking,
        forceTracking: !useTracking ? false : forceTracking,
        isDownload: allowDownload,
        cc: this.getCcValue()
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


  // CC 값 GET
  getCcValue = () => {
    const { by, nd, nc, sa } = this.state;

    if (!by) return null;

    if (!nc && !nd && !sa) return "by";
    else if (nc && !nd && !sa) return "by-nc";
    else if (!nc && nd && !sa) return "by-nd";
    else if (!nc && !nd && sa) return "by-sa";
    else if (nc && !nd && sa) return "by-nc-sa";
    else if (nc && nd && !sa) return "by-nc-nd";
  };


  // input form 초기화
  clearForm = () => {
    if (!document.getElementById("docTitle")) return true;

    document.getElementById("docTitle").value = null;
    document.getElementById("docDesc").value = null;
    document.getElementById("docFileInput").value = null;
    document.getElementById("docFile").value = null;
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


  // 파일 업로드 관리
  handleFileUpload = () => document.getElementById("docFile").click();


  //업로드 함수
  handleUpload = () => {
    const { setAlertCode, setModal } = this.props;
    const { identifier } = this.state;

    this.handleProcessModalOpen();

    // 문서 등록 API
    this.registerDocument().then(res => {
      // 업로드 성공 모달 전환
      setModal('uploadComplete', {
        privateDocumentCount : res.privateDocumentCount || 0,
        identifier : identifier
      })
    }).catch(err => {
      this.handleProcessModalClose();
      console.error(err);
      setAlertCode(2071);
      setModal(null);
    });
  };


  // 업로드 버튼 관리, input 값 유효성 검사
  handleUploadBtn = () => {
    if (!this.validateTitle() || !this.validateFile() || !this.validateTag()) return false;
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


  // 태그 변경 관리
  handleTagChange = tags => this.setState({ tags: tags }, () => this.validateTag());


  // 설명 수정 관리
  handleDescChange = e => this.setState({ desc: e.target.value });


  // 유저 트래킹 체크박스
  handleTrackingCheckbox = () => {
    const { useTracking } = this.state;
    this.setState({ useTracking: !useTracking }, () => {
      if (!useTracking) this.setState({ forceTracking: false });
    });
  };


  // 강제 트래킹 체크박스
  handleForceTrackingCheckbox = () => this.setState({ forceTracking: !this.state.forceTracking });


  // 강제 트래킹 체크박스
  handleAllowDownloadCheckbox = () => this.setState({ allowDownload: !this.state.allowDownload });


  // CC License by 체크박스
  handleCcByCheckbox = () => this.setState({ by: !this.state.by });


  // CC License nc 체크박스
  handleCcNcCheckbox = () => this.setState({ nc: !this.state.nc });


  // CC License nd 체크박스
  handleCcNdCheckbox = () => this.setState({ nd: !this.state.nd });


  // CC License nc 체크박스
  handleCcSaCheckbox = () => this.setState({ sa: !this.state.sa });


  // more 옵션 관리
  handleMoreOptions = () => {
    const { moreOptions } = this.state;
    let _moreOptions = moreOptions;
    this.setState({ moreOptions: !moreOptions }, () => {
      if (_moreOptions === true) {
        this.setState({
          useTracking: false,
          forceTracking: false,
          allowDownload: false,
          by: false,
          nc: false,
          sa: false,
          nd: false
        });
      }
    });
  };


  //제목 유효성 체크
  validateTitle = () => {
    const { title } = this.state;
    this.setState({ titleError: title.length > 0 ? "" : psString("edit-doc-error-1") });
    return title.length > 0;
  };


  //태그 유효성 체크
  validateTag = () => {
    const { tags } = this.state;
    this.setState({ tagError: tags.length > 0 ? "" : psString("edit-doc-error-2") });
    return tags.length > 0;
  };


  //파일 유효성 체크
  validateFile = () => {
    const { fileInfo } = this.state;
    this.setState({
      fileInfoError:
        fileInfo.title === null || fileInfo.filename === null ? psString("Please upload a document file.") : ""
    });
    return !(fileInfo.title === null || fileInfo.filename === null);
  };


  // 자동완성 및 태그 관련 라이브러리 함수
  autocompleteRenderInput = ({ addTag, ...props }) => {
    let handleOnChange = (e, { method }) => {
      if (method === "enter") {
        e.preventDefault();
      } else {
        props.onChange(e);
      }
    };

    let tagList = this.props.getUploadTagList,
      inputValue = (props.value && props.value.trim().toLowerCase()) || "",
      inputLength = inputValue.length;
    let suggestions = tagList.length > 0 ?
      tagList.sort((a, b) => b.value - a.value).filter((tag) => {
        return tag._id.toLowerCase().slice(0, inputLength) === inputValue;
      })
      : [];

    return (
      <AutoSuggest
        highlightFirstSuggestion={true}
        ref={props.ref}
        suggestions={suggestions}
        shouldRenderSuggestions={(value) => value && value.trim().length > 0}
        getSuggestionValue={(suggestion) => suggestion}
        renderSuggestion={(suggestion) => <span key={suggestion._id}>{suggestion._id}</span>}
        inputProps={{ ...props, onChange: handleOnChange }}
        onSuggestionSelected={(e, { suggestion }) => {
          addTag(suggestion._id);
        }}
        onSuggestionsClearRequested={() => {
        }}
        onSuggestionsFetchRequested={() => {
        }}
      />
    );
  };


  componentWillMount(): void {
    this.init();
  }


  render() {
    const { fileInfo, tags, percentage, moreOptions, titleError, fileInfoError, tagError, useTracking, forceTracking, by, nc, nd, sa, allowDownload, closeFlag } = this.state;

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
            <div className="dialog-subject">{psString("common-modal-title")}</div>
            <input type="text" placeholder={psString("title-placeholder")} id="docTitle"
                   className={"custom-input " + (titleError.length > 0 ? "custom-input-warning" : "")}
                   onChange={(e) => this.handleTitleChange(e)}/>
            <span>{titleError}</span>

            <div className="dialog-subject mt-3 mb-2">{psString("common-modal-description")}</div>
            <textarea id="docDesc"
                      placeholder={psString("description-placeholder")}
                      className="custom-textarea"
                      onChange={(e) => this.handleDescChange(e)}/>

            <div className="dialog-subject mt-3">{psString("common-modal-file")}</div>
            <input type="text" value={fileInfo.filename || ""} readOnly
                   placeholder={psString("file-placeholder")} id="docFileInput"
                   className={"custom-input-file " + (fileInfoError.length > 0 ? "custom-input-warning" : "")}
                   onClick={this.handleFileUpload}/>
            <span>{fileInfoError}</span>
            <input type="file" id="docFile" onChange={(e) => this.handleFileChange(e.target.files)}/>

            <div className="dialog-subject mt-3 mb-1">{psString("common-modal-tag")}</div>
            <TagsInput id="tags" renderInput={this.autocompleteRenderInput}
                       className={"react-tagsinput " + (tagError.length > 0 ? "tag-input-warning" : "")}
                       value={tags} onChange={this.handleTagChange} validate={false} onlyUnique/>
            <span>{tagError}</span>


            <div className="modal-more-btn-wrapper">
              <div className="modal-more-btn-line"/>
              <div className="modal-more-btn" onClick={() => this.handleMoreOptions()}>
                {psString("common-modal-more-option")}
                <img className="reward-arrow"
                     src={require("assets/image/icon/i_arrow_" + (moreOptions ? "down_grey.svg" : "up_grey.png"))}
                     alt="arrow button"/>
              </div>
            </div>

            {moreOptions &&
            <div>
              <div className="dialog-subject mb-2 mt-3">{psString("common-modal-option")}</div>
              <div className="row">
                <div className="col-12">
                  <input type="checkbox" id="useTrackingCheckbox" onChange={(e) => this.handleTrackingCheckbox(e)}
                         checked={useTracking}/>

                  <label htmlFor="useTrackingCheckbox">
                    <span><i className="material-icons">done</i></span>
                    {psString("doc-option-1")}
                  </label>
                </div>
                <div className="col-12">
                  <input type="checkbox" id="forceTrackingCheckbox"
                         onChange={(e) => this.handleForceTrackingCheckbox(e)}
                         checked={useTracking ? forceTracking : false} disabled={!useTracking}/>
                  <label htmlFor="forceTrackingCheckbox">
                    <span><i className="material-icons">done</i></span>
                    {psString("doc-option-2")}
                  </label>
                </div>
                <div className="col-12">
                  <input type="checkbox" id="allowDownload" checked={allowDownload}
                         onChange={(e) => this.handleAllowDownloadCheckbox(e)}/>
                  <label htmlFor="allowDownload">
                    <span><i className="material-icons">done</i></span>
                    {psString("doc-option-3")}
                  </label>
                </div>
              </div>

              <div className="dialog-subject mb-2 mt-3">{psString("edit-cc-license")}</div>
              <div className="row">
                <div className="col-12 col-sm-6">
                  <input type="checkbox" id="ccByCheckbox" onChange={(e) => this.handleCcByCheckbox(e)}
                         checked={by}/>
                  <label htmlFor="ccByCheckbox">
                    <span><i className="material-icons">done</i></span>
                    Attribution
                  </label>
                </div>
                <div className="col-12 col-sm-6">
                  <input type="checkbox" id="ccNcCheckbox" onChange={(e) => this.handleCcNcCheckbox(e)}
                         checked={!by ? false : nc} disabled={!by}/>
                  <label htmlFor="ccNcCheckbox">
                    <span><i className="material-icons">done</i></span>
                    Noncommercial
                  </label>
                </div>
                <div className="col-12 col-sm-6">
                  <input type="checkbox" id="ccNdCheckbox" onChange={(e) => this.handleCcNdCheckbox(e)}
                         checked={!by || sa ? false : nd} disabled={!by || sa}/>
                  <label htmlFor="ccNdCheckbox">
                    <span><i className="material-icons">done</i></span>
                    No Derivative Works
                  </label>
                </div>
                <div className="col-12 col-sm-6">
                  <input type="checkbox" id="ccSaCheckbox" onChange={(e) => this.handleCcSaCheckbox(e)}
                         checked={!by || nd ? false : sa} disabled={!by || nd}/>
                  <label htmlFor="ccSaCheckbox">
                    <span><i className="material-icons">done</i></span>
                    Share Alike
                  </label>
                </div>
              </div>
            </div>
            }
          </div>

          <div className="custom-modal-footer">
            <div onClick={() => this.handleClickClose("classicModal")}
                 className="cancel-btn ">{psString("common-modal-cancel")}</div>
            <div onClick={() => this.handleUploadBtn()} className="ok-btn">{psString("common-modal-upload")}</div>
          </div>

          <div className="progress-wrapper" id="progressWrapper"/>
          <div className="progress-modal" id="progressModal">
            <div className="progress-modal-second">
              <div className="progress-percent">{percentage}%</div>
              <Circle size={100} color={"#0089ff"}/>
            </div>
          </div>
        </div>
      </div>
    );
  };
}


export default UploadDocumentModal;
