import React from "react";
import AutoSuggest from "react-autosuggest";
import TagsInput from "react-tagsinput";
import { psString } from "../../../config/localization";
import MainRepository from "../../../redux/MainRepository";
import { FadingCircle } from "better-react-spinkit";
import common_view from "../../../common/common_view";
import common from "../../../common/common";
import { APP_PROPERTIES } from "../../../properties/app.properties";


class PublishModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ratio: null,
      registerLoading: false,
      closeFlag: false,
      tags: [],
      tagError: "",
      useTracking: false,   // 트래킹 사용 유무
      forceTracking: false,   // 트래킹 강제 사용 유무
      allowDownload: false,   // 다운로드 허용
      classicModal: false,    // 모달 종료
      by: false,   //CC License by 사용유무
      nc: false,   //CC License nc 사용유무
      nd: false,   //CC License nd 사용유무
      sa: false,   //CC License sa 사용유무
      moreOptions: false    // more options show / hide
    };
  }


  // 초기화
  init = () => {
    common_view.setBodyStyleLock();
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


  // CC 상세값 GET
  getCcDetailValue = cc => {
    if (!cc || cc === "") return false;

    // by, by-nc, by-nd, by-sa, by-nc-sa, by-nc-nd
    return new Promise((resolve, reject) => {
      this.setState({
        by: true,
        nc: cc === "by-nc" || cc === "by-nc-sa" || cc === "by-nc-nd",
        nd: cc === "by-nd" || cc === "by-nc-nd",
        sa: cc === "by-sa" || cc === "by-nc-sa"
      }, () => resolve());
    });
  };


  // 모달 숨기기 클래스 추가
  setCloseFlag = () =>
    new Promise(resolve =>
      this.setState({ closeFlag: true }, () => resolve()));


  // 모달 취소버튼 클릭 관리
  handleClickClose = () =>
    this.setCloseFlag()
      .then(() => common.delay(200))
      .then(() => common_view.setBodyStyleUnlock())
      .then(() => this.props.setModal(null));


  //태그 변경 관리
  handleTagChange = (tags) =>
    this.setState({ tags: tags }, () => {
      this.validateTag();
    });


  // 출판 버튼 클릭 관리
  handleClickPublish = () => {
    const { setAlertCode, setModal } = this.props;
    if (!this.validateTag()) return false;

    return this.setState({ registerLoading: true }, () =>
      this.handlePublish()
      // 퍼블리시 완료 모달 오픈
        .then(() => setModal('publishComplete', {documentData : this.props.getModalData.documentData}))
        .catch(err => {
          console.error(err);
          setAlertCode(2071);
          setModal(null);
        })
    );
  };


  // publish 관리
  handlePublish = () => {
    const { tags, useTracking, forceTracking, allowDownload } = this.state;

    return MainRepository.Document.publishDocument({
      isPublic: true,
      documentId: this.props.getModalData.documentData.documentId,
      tags: tags,
      useTracking: useTracking,
      forceTracking: !useTracking ? false : forceTracking,
      isDownload: allowDownload,
      cc: this.getCcValue()
    });
  };


  // 유저 트래킹 체크박스
  handleTrackingCheckbox = () => {
    const { useTracking } = this.state;

    let newValue = !useTracking;
    this.setState({ useTracking: newValue }, () => {
      if (!useTracking) this.setState({ forceTracking: false });
    });
  };


  // 강제 트래킹 체크박스
  handleForceTrackingCheckbox = () => {
    const { forceTracking } = this.state;
    let newValue = !forceTracking;
    this.setState({ forceTracking: newValue });
  };


  // 다운로드 허용 체크박스
  handleAllowDownloadCheckbox = () => {
    const { allowDownload } = this.state;
    let newValue = !allowDownload;
    this.setState({ allowDownload: newValue });
  };


  // CC License by 체크박스
  handleCcByCheckbox = () => {
    const { by } = this.state;
    let newValue = !by;
    this.setState({ by: newValue });
  };


  // CC License nc 체크박스
  handleCcNcCheckbox = () => {
    const { nc } = this.state;
    let newValue = !nc;
    this.setState({ nc: newValue });
  };


  // CC License nd 체크박스
  handleCcNdCheckbox = () => {
    const { nd } = this.state;
    let newValue = !nd;
    this.setState({ nd: newValue });
  };


  // CC License nc 체크박스
  handleCcSaCheckbox = () => {
    const { sa } = this.state;
    let newValue = !sa;
    this.setState({ sa: newValue });
  };


  // more 옵션 관리 버튼
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


  //태그 유효성 체크
  validateTag = () => {
    const { tags } = this.state;
    this.setState({ tagError: tags.length > 0 ? "" : psString("edit-doc-error-2") });
    return tags.length > 0;
  };


  // 자동완성 및 태그 관련 라이브러리 함수
  autocompleteRenderInput = ({ addTag, ...props }) => {
    let handleOnChange = (e, { newValue, method }) => {
      if (method === "enter") e.preventDefault();
      else props.onChange(e);
    };

    let tagList = this.props.getTagList;
    let inputValue = (props.value && props.value.trim().toLowerCase()) || "";
    let inputLength = inputValue.length;
    let suggestions = tagList.length > 0 ?
      tagList.filter((tag) => tag._id.toLowerCase().slice(0, inputLength) === inputValue) : [];

    return (
      <AutoSuggest
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
    const { registerLoading, closeFlag, moreOptions, allowDownload, tags, useTracking, forceTracking, tagError, by, nc, nd, sa } = this.state;

    return (
      <div>
        <div className="custom-modal-container">
          <div className="custom-modal-wrapper"/>
          <div className={"custom-modal " + (closeFlag ? "custom-hide" : "")}>


            <div className="custom-modal-title">
              <i className="material-icons modal-close-btn"
                 onClick={() => this.handleClickClose()}>close</i>
              <h3>{psString("publish-modal-title")}</h3>
            </div>


            <div className="custom-modal-content">
              <div className="publish-modal-desc">{psString("publish-modal-desc-1")}</div>
              <div className="dialog-subject mt-3">{psString("common-modal-tag")}</div>
              {tags &&
              <TagsInput id="tags" renderInput={this.autocompleteRenderInput}
                         className={"react-tagsinput " + (tagError.length > 0 ? "tag-input-warning" : "")}
                         value={tags} onChange={this.handleTagChange} validate={false} onlyUnique/>
              }
              <span> {tagError}</span>

              <div className="modal-more-btn-wrapper">
                <div className="modal-more-btn-line"/>
                <div className="modal-more-btn" onClick={() => this.handleMoreOptions()}>
                  {psString("common-modal-more-option")}
                  <img className="reward-arrow"
                       src={APP_PROPERTIES.domain().static + "/image/icon/i_arrow_" + (moreOptions ? "down_grey.svg" : "up_grey.png")}
                       alt="arrow button"/>
                </div>
              </div>

              {moreOptions &&
              <div>
                <div className="dialog-subject mb-2 mt-3">{psString("common-modal-option")}</div>
                <div className="row">
                  <div className="col-12">
                    <input type="checkbox" id="useTrackingCheckboxEdit"
                           onChange={(e) => this.handleTrackingCheckbox(e)}
                           checked={useTracking}/>
                    <label htmlFor="useTrackingCheckboxEdit">
                      <span><i className="material-icons">done</i></span>
                      {psString("doc-option-1")}
                    </label>
                  </div>
                  <div className="col-12">
                    <input type="checkbox" id="forceTrackingCheckboxEdit"
                           onChange={(e) => this.handleForceTrackingCheckbox(e)}
                           checked={useTracking ? forceTracking : false} disabled={!useTracking}/>
                    <label htmlFor="forceTrackingCheckboxEdit">
                      <span><i className="material-icons">done</i></span>
                      {psString("doc-option-2")}
                    </label>
                  </div>
                  <div className="col-12">
                    <input type="checkbox" id="allowDownloadEdit" checked={allowDownload}
                           onChange={(e) => this.handleAllowDownloadCheckbox(e)}/>
                    <label htmlFor="allowDownloadEdit">
                      <span><i className="material-icons">done</i></span>
                      {psString("doc-option-3")}
                    </label>
                  </div>
                </div>


                <div className="dialog-subject mb-2 mt-3">{psString("edit-cc-license")}</div>
                <div className="row">
                  <div className="col-12 col-sm-6">
                    <input type="checkbox" id="ccByCheckboxEdit" onChange={(e) => this.handleCcByCheckbox(e)}
                           checked={by}/>
                    <label htmlFor="ccByCheckboxEdit">
                      <span><i className="material-icons">done</i></span>
                      Attribution
                    </label>
                  </div>
                  <div className="col-12 col-sm-6">
                    <input type="checkbox" id="ccNcCheckboxEdit" onChange={(e) => this.handleCcNcCheckbox(e)}
                           checked={!by ? false : nc} disabled={!by}/>
                    <label htmlFor="ccNcCheckboxEdit">
                      <span><i className="material-icons">done</i></span>
                      Noncommercial
                    </label>
                  </div>
                  <div className="col-12 col-sm-6">
                    <input type="checkbox" id="ccNdCheckboxEdit" onChange={(e) => this.handleCcNdCheckbox(e)}
                           checked={!by || sa ? false : nd} disabled={!by || sa}/>
                    <label htmlFor="ccNdCheckboxEdit">
                      <span><i className="material-icons">done</i></span>
                      No Derivative Works
                    </label>
                  </div>
                  <div className="col-12 col-sm-6">
                    <input type="checkbox" id="ccSaCheckboxEdit" onChange={(e) => this.handleCcSaCheckbox(e)}
                           checked={!by || nd ? false : sa} disabled={!by || nd}/>
                    <label htmlFor="ccSaCheckboxEdit">
                      <span><i className="material-icons">done</i></span>
                      Share Alike
                    </label>
                  </div>
                </div>
              </div>
              }
            </div>


            <div className="custom-modal-footer">
              <div onClick={() => this.handleClickClose()} className="cancel-btn">
                {psString("common-modal-cancel")}</div>
              <div onClick={() => this.handleClickPublish()}
                   className={"ok-btn " + (registerLoading ? "btn-disabled" : "")}>
                {registerLoading &&
                <div className="loading-btn-wrapper"><FadingCircle color="#3681fe" size={17}/></div>}
                {psString("publish-modal-publish-btn")}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PublishModal;
