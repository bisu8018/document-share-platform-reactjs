import React from "react";
import AutoSuggest from "react-autosuggest";
import TagsInput from "react-tagsinput";

import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import MainRepository from "../../redux/MainRepository";
import { Circle } from "better-react-spinkit";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class UploadDocumentModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
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
      classicModal: false,    // 모달 종료
      by: false,   //CC License by 사용유무
      nc: false,   //CC License nc 사용유무
      nd: false,   //CC License nd 사용유무
      sa: false,   //CC License sa 사용유무
      username: null,
      desc: ""
    };
  }


  // input form 초기화
  clearForm = () => {
    document.getElementById("docTitle").value = null;
    document.getElementById("docDesc").value = "";
    document.getElementById("docFileInput").value = null;
    document.getElementById("docFile").value = null;
  };


  // 모달 state 값 초기화
  clearState = () => {
    this.setState({
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
      classicModal: false,    // 모달 종료
      by: false,   //CC License by 사용유무
      nc: false,   //CC License nc 사용유무
      nd: false,   //CC License nd 사용유무
      sa: false,   //CC License sa 사용유무
      username: null,
      desc: ""
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

  // 파일 업로드 관리
  handleFileUpload = () => {
    document.getElementById("docFile").click();
  };


  //업로드 함수
  handleUpload = () => {
    const { getDrizzle, getMyInfo } = this.props;
    const { title, fileInfo, tags, desc, useTracking, forceTracking, allowDownload } = this.state;
    let ethAccount = getMyInfo.ethAccount;
    let userInfo = MainRepository.Account.getMyInfo();

    document.getElementById("progressModal").style.display = "block";   //진행도 모달 열기
    document.getElementById("progressWrapper").style.display = "block";   //진행도 wrapper 모달 열기

    MainRepository.Document.registerDocument({
      fileInfo: fileInfo,
      userInfo: userInfo,
      ethAccount: ethAccount,
      title: title,
      desc: desc,
      tags: tags,
      useTracking: useTracking,
      forceTracking: !useTracking ? false : forceTracking,
      isDownload: allowDownload,
      cc: this.getCcValue()
    }, this.handleProgress, (result) => { //문서 업로드 완료
      if (getDrizzle && ethAccount) getDrizzle.registerDocumentToSmartContract(result.documentId);

      document.getElementById("progressModal").style.display = "none"; //진행도 모달 닫기
      document.getElementById("progressWrapper").style.display = "none"; //진행도 모달 wrapper 닫기

      this.handleClose("classicModal"); //모달 닫기
    });
  };


  // 업로드 버튼 관리
  handleUploadBtn = () => {
    // input 값 유효성 검사
    if (!this.validateTitle() || !this.validateFile() || !this.validateTag()) {
      return false;
    }
    this.handleUpload();
  };


  // 파일 업로드 로딩 바 핸들 함수
  handleProgress = (e) => {
    let percent = Math.round((e.loaded / e.total) * 100);
    if (percent !== null) {
      this.setState({ percentage: percent });
    }
  };


  //file input 등록/변경 시
  handleFileChange = (e) => {
    const file = e[0];
    if (!file) return false;
    let filename = file.name;
    let fileSize = file.size;
    let ext = filename.substring(filename.lastIndexOf(".") + 1, filename.length).toLowerCase();
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


  // 모달 open 관리
  handleClickOpen = (modal) => {
    const { getMyInfo } = this.props;
    if (!MainRepository.Account.isAuthenticated()) {
      return MainRepository.Account.login();
    } else {
      const x = [];
      x[modal] = true;
      this.setState(x);
    }

    let username = MainRepository.Account.getMyInfo().username;
    let ethAccount = getMyInfo.ethAccount;
    let _username = username ? username : ethAccount;
    this.setState({ username: _username });
  };


  // 모달 종료 관리
  handleClose = (modal) => {
    const x = [];
    x[modal] = false;
    this.setState(x);
    this.clearForm();
    this.clearState();
  };


  // 제목 변경 관리
  handleTitleChange = e => {
    this.setState({ title: e.target.value }, () => {
      this.validateTitle();
    });
  };


  // 태그 변경 관리
  handleTagChange = (tags) => {
    this.setState({ tags: tags }, () => {
      this.validateTag();
    });
  };


  // 설명 수정 관리
  handleDescChange = (e) => {
    this.setState({ desc: e.target.value });
  };


  // 유저 트래킹 체크박스
  handleTrackingCheckbox = () => {
    const { useTracking } = this.state;
    let newValue = !useTracking;
    this.setState({
      useTracking: newValue
    }, () => {
      if (!useTracking) {
        this.setState({
          forceTracking: false
        });
      }
    });
  };


  // 강제 트래킹 체크박스
  handleForceTrackingCheckbox = () => {
    const { forceTracking } = this.state;
    let newValue = !forceTracking;
    this.setState({
      forceTracking: newValue
    });
  };


  // 강제 트래킹 체크박스
  handleAllowDownloadCheckbox = () => {
    const { allowDownload } = this.state;
    let newValue = !allowDownload;
    this.setState({
      allowDownload: newValue
    });
  };


  // CC License by 체크박스
  handleCcByCheckbox = () => {
    const { by } = this.state;
    let newValue = !by;
    this.setState({
      by: newValue
    });
  };


  // CC License nc 체크박스
  handleCcNcCheckbox = () => {
    const { nc } = this.state;
    let newValue = !nc;
    this.setState({
      nc: newValue
    });
  };


  // CC License nd 체크박스
  handleCcNdCheckbox = () => {
    const { nd } = this.state;
    let newValue = !nd;
    this.setState({
      nd: newValue
    });
  };


  // CC License nc 체크박스
  handleCcSaCheckbox = () => {
    const { sa } = this.state;
    let newValue = !sa;
    this.setState({
      sa: newValue
    });
  };


  //제목 유효성 체크
  validateTitle = () => {
    const { title } = this.state;
    this.setState({
      titleError:
        title.length > 0 ? "" : "Title must be longer than 1 character ."
    });
    return title.length > 0;
  };

  //태그 유효성 체크
  validateTag = () => {
    const { tags } = this.state;
    this.setState({
      tagError:
        tags.length > 0 ? "" : "Tag must be at least 1 tag ."
    });
    return tags.length > 0;
  };

  //파일 유효성 체크
  validateFile = () => {
    const { fileInfo } = this.state;
    this.setState({
      fileInfoError:
        fileInfo.title === null || fileInfo.filename === null ? "Please upload a document file ." : ""
    });
    return !(fileInfo.title === null || fileInfo.filename === null);
  };

  // 자동완성 및 태그 관련 라이브러리 함수
  autocompleteRenderInput = ({ addTag, ...props }) => {
    let handleOnChange = (e, { newValue, method }) => {
      if (method === "enter") {
        e.preventDefault();
      } else {
        props.onChange(e);
      }
    };

    let tagList = this.props.getTagList;
    let inputValue = (props.value && props.value.trim().toLowerCase()) || "";
    let inputLength = inputValue.length;
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

  render() {
    const { classicModal, fileInfo, tags, percentage, titleError, fileInfoError, tagError, useTracking, forceTracking, by, nc, nd, sa } = this.state;
    const { type } = this.props;

    return (
      <span>
            <div className="upload-btn d-none d-sm-inline-block"
                 onClick={() => this.handleClickOpen("classicModal")}>
              Upload
            </div>
            <div className="mobile-upload-btn d-sm-none d-inline-block"
                 onClick={() => this.handleClickOpen("classicModal")}/>


        {type && type === "menu" &&
        <span className="d-inline-block d-sm-none" onClick={() => this.handleClickOpen("classicModal")}>Upload</span>
        }


        <Dialog
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
                <h3>Upload document</h3>
              </DialogTitle>


              <DialogContent id="classic-modal-slide-description ">
                <div className="dialog-subject">Title</div>
                <input type="text" placeholder="Title of the uploading document" id="docTitle"
                       className={"custom-input " + (titleError.length > 0 ? "custom-input-warning" : "")}
                       onChange={(e) => this.handleTitleChange(e)}/>
                <span>{titleError}</span>


                <div className="dialog-subject mt-3 mb-2">Description</div>
                <textarea id="docDesc"
                          placeholder="Description of the uploading document"
                          className="custom-textarea"
                          onChange={(e) => this.handleDescChange(e)}/>


                <div className="dialog-subject mt-3">File</div>
                <input type="text" value={fileInfo.filename || ""} readOnly
                       placeholder="Click here to upload document" id="docFileInput"
                       className={"custom-input-file " + (fileInfoError.length > 0 ? "custom-input-warning" : "")}
                       onClick={this.handleFileUpload}/>
                <span>{fileInfoError}</span>
                <input type="file" id="docFile" onChange={(e) => this.handleFileChange(e.target.files)}/>


                <div className="dialog-subject mt-3 mb-1">Tag</div>
                <TagsInput id="tags" renderInput={this.autocompleteRenderInput}
                           className={"react-tagsinput " + (tagError.length > 0 ? "tag-input-warning" : "")}
                           value={tags} onChange={this.handleTagChange} validate={false} onlyUnique/>
                           <span>{tagError}</span>


                <div className="dialog-subject mb-2 mt-3">Option</div>
                <div className="row">
                  <div className="col-12 col-sm-6">
                    <input type="checkbox" id="useTrackingCheckbox" onChange={(e) => this.handleTrackingCheckbox(e)}
                           checked={useTracking}/>

                    <label htmlFor="useTrackingCheckbox">
                      <span><i className="material-icons">done</i></span>
                         Use audience tracking.
                    </label>
                  </div>
                  <div className="col-12 col-sm-6">
                    <input type="checkbox" id="forceTrackingCheckbox"
                           onChange={(e) => this.handleForceTrackingCheckbox(e)}
                           checked={useTracking ? forceTracking : false} disabled={!useTracking}/>
                    <label htmlFor="forceTrackingCheckbox">
                      <span><i className="material-icons">done</i></span>
                         Force the audience to tracking.
                    </label>
                   </div>
                  <div className="col-12 col-sm-6">
                    <input type="checkbox" id="allowDownload"
                           onChange={(e) => this.handleAllowDownloadCheckbox(e)}/>
                    <label htmlFor="allowDownload">
                      <span><i className="material-icons">done</i></span>
                         Allow download document.
                    </label>
                   </div>
                 </div>


                <div className="dialog-subject mb-2 mt-3">CC License</div>
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
                           checked={nc}/>
                    <label htmlFor="ccNcCheckbox">
                      <span><i className="material-icons">done</i></span>
                     Noncommercial
                    </label>
                  </div>
                  <div className="col-12 col-sm-6">
                    <input type="checkbox" id="ccNdCheckbox" onChange={(e) => this.handleCcNdCheckbox(e)}
                           checked={sa ? false : nd} disabled={sa}/>
                    <label htmlFor="ccNdCheckbox">
                      <span><i className="material-icons">done</i></span>
                        No Derivative Works
                    </label>
                  </div>
                  <div className="col-12 col-sm-6">
                    <input type="checkbox" id="ccSaCheckbox" onChange={(e) => this.handleCcSaCheckbox(e)}
                           checked={nd ? false : sa} disabled={nd}/>
                    <label htmlFor="ccSaCheckbox">
                      <span><i className="material-icons">done</i></span>
                         Share Alike
                    </label>
                  </div>
                 </div>





              </DialogContent>


              <DialogActions className="modal-footer">
                <div onClick={() => this.handleClose("classicModal")} className="cancel-btn ">Cancel</div>
                <div onClick={() => this.handleUploadBtn()} className="ok-btn">Upload</div>
              </DialogActions>


              <div className="progress-wrapper" id="progressWrapper"/>
              <div className="progress-modal" id="progressModal">
                <div className="progress-modal-second">
                  <div className="progress-percent">{percentage}%</div>
                  <Circle size={100} color={"#3681fe"}/>
                </div>
              </div>
            </Dialog>
      </span>
    );
  }
}

export default UploadDocumentModal;
