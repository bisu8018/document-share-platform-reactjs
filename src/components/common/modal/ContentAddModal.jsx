import React from "react";
import { psString } from "../../../config/localization";
import AutoSuggest from "react-autosuggest";
import TagsInput from "react-tagsinput";
import { Circle } from "better-react-spinkit";
import MainRepository from "../../../redux/MainRepository";
import history from "apis/history/history";


class ContentAddModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      tagError: "",
      moreOptions: false,
      useTracking: false,   // 트래킹 사용 유무
      forceTracking: false,   // 트래킹 강제 사용 유무
      allowDownload: false,   // 다운로드 허용
      percentage: 0,
    };
  }

  // 문서 등록 API
  registerDocument = () => {
    const { getMyInfo, setAlertCode, setMyInfo, title, desc, fileInfo, } = this.props;
    const {  tags, useTracking, forceTracking, allowDownload } = this.state;

    let ethAccount = getMyInfo.ethAccount,
      userInfo = MainRepository.Account.getMyInfo();

    return new Promise((resolve, reject) => {
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


  // 프라이빗 문서 보유수 체크
  checkPrivateDoc = res =>{
    const { getMyInfo, setAlertCode, setMyInfo  } = this.props;
    return new Promise(resolve => {
      let tmpMyInfo = getMyInfo;
      tmpMyInfo.privateDocumentCount = res.privateDocumentCount;
      setMyInfo(tmpMyInfo);
      resolve(setAlertCode());
    })
  };



  //태그 유효성 체크
  validateTag = () => {
    const { tags } = this.state;
    this.setState({ tagError: tags.length > 0 ? "" : psString("edit-doc-error-2") });
    return tags.length > 0;
  };


  // 태그 변경 관리
  handleTagChange = tags => this.setState({ tags: tags }, () => this.validateTag());


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


  // 파일 업로드 로딩 바 핸들 함수
  handleProgress = e => {
    let percent = Math.round((e.loaded / e.total) * 100);
    if (percent !== null) this.setState({ percentage: percent });
  };


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
    const { setAlertCode, identifier } = this.props;

    this.handleProcessModalOpen();

    // 문서 등록 API
    this.registerDocument().then(res => {
      this.checkPrivateDoc(res).then(() => {
        setAlertCode(2077);
        history.push("/@" + identifier);
      });
    }).catch(err => {
      console.error(err);
      setAlertCode(2071);
    });
  };


  // 자동완성 및 태그 관련 라이브러리 함수
  autocompleteRenderInput = ({ addTag, ...props }) => {
    let handleOnChange = (e, { method }) => {
      if (method === "enter") e.preventDefault();
      else props.onChange(e);
    };

    let tagList = this.props.getUploadTagList,
      inputValue = (props.value && props.value.trim().toLowerCase()) || "",
      inputLength = inputValue.length;
    let suggestions = tagList.length > 0 ?
      tagList.sort((a, b) => b.value - a.value).filter((tag) =>
        tag._id.toLowerCase().slice(0, inputLength) === inputValue) : [];

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
    const { tags, tagError, moreOptions, useTracking, forceTracking, allowDownload,  by, nc, nd, sa, percentage  } = this.state;

    return (
      <div className="custom-modal-container">
        <div className="custom-modal-wrapper"/>
        <div className={"custom-modal"}>


          <div className="custom-modal-title">
            <i className="material-icons modal-close-btn"
               onClick={() => this.props.closeModal()}>close</i>
            <h3>{psString("common-modal-publish")}</h3>
          </div>


          <div className="custom-modal-content tal">
            <div className="dialog-subject mt-2 mb-1">{psString("common-modal-tag")}</div>
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
            <div className="mt-4">
              <div className="dialog-subject mb-2">{psString("common-modal-option")}</div>
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
            </div>}
          </div>


          <div className="custom-modal-footer">
            <div onClick={() => this.props.closeModal()}
                 className="cancel-btn ">{psString("common-modal-cancel")}</div>
            <div onClick={() => this.handleUpload()} className="ok-btn">{psString("publish-modal-publish-btn")}</div>
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
  }
}

export default ContentAddModal;
