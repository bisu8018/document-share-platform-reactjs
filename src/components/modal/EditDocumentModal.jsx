import React from "react";
import AutoSuggest from "react-autosuggest";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import history from "apis/history/history";

import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import MainRepository from "../../redux/MainRepository";
import Tooltip from "@material-ui/core/Tooltip";

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
    const { documentData, match } = this.props;
    const { title, desc, tags, useTracking, forceTracking } = this.state;
    const data = {
      documentId: documentData.documentId,
      desc: desc,
      title: title,
      tags: tags,
      useTracking: useTracking,
      forceTracking: forceTracking
    };
    MainRepository.Document.updateDocument(data, (result) => {
      history.push("/" + match.params.identification + "/" + result.seoTitle);
      this.handleClose();
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

  handleTrackingCheckbox = () => {
    const { useTracking } = this.state;
    let newValue = !useTracking;
    this.setState({
      useTracking: newValue
    });
  };

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

    let inputValue = (props.value && props.value.trim().toLowerCase()) || "";
    let inputLength = inputValue.length;
    let suggestions = this.props.tagList.length > 0 ?
      this.props.tagList.filter((tag) => {
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
          <div className="statistics-btn pt-1" onClick={() => this.handleClickOpen("classicModal")}>
            <i className="material-icons">settings</i>
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

                  <div className="dialog-subject mb-1 mt-3">Option</div>
                  <label className="c-pointer col-12 col-sm-6 p-0">
                  <input type="checkbox" onChange={(e) => this.handleTrackingCheckbox(e)} checked={useTracking}/>
                  <span className="checkbox-text">Use audience tracking.</span>
                  </label>
                <label className="c-pointer col-12 col-sm-6 float-righ p-0">
                  <input type="checkbox" onChange={(e) => this.handleForceTrackingCheckbox(e)} checked={forceTracking}/>
                  <span className="checkbox-text">Force the audience to tracking.</span>
                </label>
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
