import React from "react";
import AutoSuggest from "react-autosuggest";
import TagsInput from "react-tagsinput";
import history from "apis/history/history";

import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import MainRepository from "../../redux/MainRepository";
import Tooltip from "@material-ui/core/Tooltip";
import Common from "../../util/Common";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class EditDocumentModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: "",
      titleError: "",
      tags: [],
      tagError: "",
      useTracking: false,
      forceTracking: false,
      registerOnChain: false,
      classicModal: false,
      username: null,
      desc: ""
    };
  }

  clearForm = () => {
    document.getElementById("docTitle").value = null;
    document.getElementById("docDesc").value = null;
  };

  clearState = () => {
    this.setState({
      title: "",
      titleError: "",
      tags: [],
      tagError: "",
      useTracking: false,
      forceTracking: false,
      classicModal: false,
      username: null,
      desc: ""
    });
  };

  handleConfirmBtn = () => {
    // input 값 유효성 검사
    if (!this.validateTitle() || !this.validateTag()) {
      return false;
    }
    this.handleConfirm();
  };

  handleConfirm = () => {
    const { documentData } = this.props;
    const { title, desc, tags, useTracking, forceTracking } = this.state;
    const data = {
      documentId: documentData.documentId,
      desc: desc,
      title: title,
      tags: tags,
      useTracking: useTracking,
      forceTracking: !useTracking ? false : forceTracking,
    };
    MainRepository.Document.updateDocument(data, (result) => {
      history.push("/" + Common.getPath() + "/" + result.seoTitle);
      this.handleClose();

      //임시로 사용, redux로 교체 필요
      document.location.reload();
    });
  };

  handleClickOpen = (modal) => {
    const { documentData } = this.props;
    if (!MainRepository.Account.isAuthenticated()) {
      return MainRepository.Account.login();
    } else {
      const x = [];
      x[modal] = true;
      this.setState(x);
    }

    let username = MainRepository.Account.getMyInfo().username;
    let email = MainRepository.Account.getMyInfo().email;
    let _username = username ? username : (email ? email : documentData.accountId);
    this.setState({ username: _username });
    this.setState({ title: documentData.title });
    this.setState({ desc: documentData.desc });
    this.setState({ tags: documentData.tags });
    this.setState({ useTracking: documentData.useTracking || false });
    this.setState({ forceTracking: documentData.forceTracking || false });
  };

  handleClose = (modal) => {
    const x = [];
    x[modal] = false;
    this.setState(x);
    this.clearForm();
    this.clearState();
  };

  handleTitleChange = e => {
    this.setState({ title: e.target.value }, () => {
      this.validateTitle();
    });
  };

  handleTagChange = (tags) => {
    this.setState({ tags: tags }, () => {
      this.validateTag();
    });
  };

  handleDescChange = (e) => {
    this.setState({ desc: e.target.value });
  };

  // 유저 트래킹 체크박스
  handleTrackingCheckbox= () => {
    const { useTracking } = this.state;

    let newValue = !useTracking;
    this.setState({
      useTracking: newValue
    }, () => {
      if(!useTracking) {
        this.setState({
          forceTracking: false
        })
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
      tagList.filter((tag) => {
        return tag._id.toLowerCase().slice(0, inputLength) === inputValue;
      })
      : [];

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

  render() {
    const { classicModal, title, desc, tags, useTracking, forceTracking, titleError, tagError } = this.state;
    const { type } = this.props;

    return (
      <span>
        <Tooltip title="Settings of this document" placement="bottom">
          <div className="viewer-btn" onClick={() => this.handleClickOpen("classicModal")}>
            <i className="material-icons">settings</i> Settings
          </div>
        </Tooltip>
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
                <h3>Edit uploaded document</h3>
              </DialogTitle>


              <DialogContent id="classic-modal-slide-description">
                <div className="dialog-subject">Title</div>
                <input type="text" placeholder="Title of the uploading document" id="docTitle"
                       className={"custom-input " + (titleError.length > 0 ? "custom-input-warning" : "")}
                       value={title}
                       onChange={(e) => this.handleTitleChange(e)}/>
                <span>{titleError}</span>

                <div className="dialog-subject mt-3 mb-2">Description</div>
                <textarea id="docDesc" value={desc} placeholder="Description of the uploading document"
                          onChange={(e) => this.handleDescChange(e)} className="custom-textarea"/>

                <div className="dialog-subject mt-3">Tag</div>
                {tags &&
                <TagsInput id="tags" renderInput={this.autocompleteRenderInput}
                           className={"react-tagsinput " + (tagError.length > 0 ? "tag-input-warning" : "")}
                           value={tags} onChange={this.handleTagChange} validate={false} onlyUnique/>
                }
                <span> {tagError}</span>

                 <div className="dialog-subject mb-2 mt-3">Option</div>
                  <div className="row">
                  <div className="col-12 col-sm-6" >
                    <input type="checkbox" id="useTrackingCheckboxEdit"  onChange={(e) => this.handleTrackingCheckbox(e)}
                           checked={useTracking}/>

                    <label htmlFor="useTrackingCheckboxEdit">
                      <span><i className="material-icons">done</i></span>
                         Use audience tracking.
                    </label>
                  </div>
                  <div className="col-12 col-sm-6">
                    <input type="checkbox" id="forceTrackingCheckboxEdit"
                           onChange={(e) => this.handleForceTrackingCheckbox(e)}
                           checked={useTracking ? forceTracking : false} disabled={!useTracking}/>
                    <label htmlFor="forceTrackingCheckboxEdit">
                      <span><i className="material-icons">done</i></span>
                         Force the audience to tracking.
                    </label>
                   </div>
                 </div>
                  </DialogContent>


                  <DialogActions className="modal-footer">
                  <div onClick={() => this.handleClose("classicModal")} className="cancel-btn">Cancel</div>
                  <div onClick={() => this.handleConfirmBtn()} className="ok-btn">Confirm</div>
                  </DialogActions>
                  </Dialog>
                  </span>
    );
  }
}

export default EditDocumentModal;
