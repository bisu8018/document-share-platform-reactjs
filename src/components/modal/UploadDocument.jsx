import React from "react";
import Autosuggest from "react-autosuggest";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css"; // If using WebPack and style-loader.
import * as restapi from "apis/DocApi";

import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class UploadDocument extends React.Component {

  anchorElLeft = null;
  anchorElTop = null;
  anchorElBottom = null;
  anchorElRight = null;

  constructor(props) {
    super(props);

    this.state = {
      percentage: 0,
      nickname: "",
      fullWidth: true,
      classicModal: false,
      openLeft: false,
      openTop: false,
      openBottom: false,
      openRight: false,
      fileInfo: {
        file: null,
        size: -1,
        ext: null,
        owner: null,
        title: null,
        filename: null
      },
      stackId: null,
      tags: [],
      category: null
    };
  }

  getNickname = () => {
    return this.props.auth.getUserInfo().nickname;
  };

  handleClickOpen = (modal) => {
    const { drizzleApis, auth } = this.props;
    if (!auth.isAuthenticated()) {
      return auth.login(true);
    } else {
      const x = [];
      x[modal] = true;
      this.setState(x);
    }

    const account = drizzleApis.getLoggedInAccount();
    const nickname = this.getNickname() ? this.getNickname() : account;
    this.setState({ nickname: nickname });
  };

  handleClose = (modal) => {
    const x = [];
    x[modal] = false;
    this.setState(x);
    this.clearForm();
    this.clearFileInfo();
  };

  onChangeTag = (tags) => {
    this.setState({ tags });
  };

  onUploadDoc = () => {
    const { auth, drizzleApis } = this.props;
    const self = this;

    const fileInfo = this.state.fileInfo;
    const tags = this.state.tags ? this.state.tags : [];
    const title = document.getElementById("docTitle").value;
    const desc = document.getElementById("docDesc").value;
    //const nickname = this.props.auth.getUserInfo().nickname;
    const userInfo = auth.getUserInfo();

    if (!this.state.fileInfo || !this.state.fileInfo.file) {
      alert("Please select a document file");
      return;
    }
    document.getElementById("progressModal").style.display = "block";
    const ethAccount = drizzleApis.getLoggedInAccount();
    console.log("Selected a Document File", this.state.fileInfo);
    restapi.registDocument({
      fileInfo: fileInfo,
      userInfo: userInfo,
      ethAccount: ethAccount,
      title: title,
      desc: desc,
      tags: tags
    }, this.progressHandler).then((result) => {
      console.log("UploadDocument", result);
      document.getElementById("progressModal").style.display = "none";
      const stackId = drizzleApis.registDocumentToSmartContract(result.documentId);
      self.setState({ stackId });
      /*
      if(stackId){
        self.setState({ stackId });
      } else {
        alert('Document registration Smart contract failed.');
      }
      */
      this.handleClose("classicModal");
      console.log("Regist Document End SUCCESS", result);
    });
  };

  onChangeNickname = (e) => {
    //console.log(e.target);
    const nickname = e.target.value;
    this.setState({ nickname: nickname });
  };

  onChangeCategory = (e) => {
    console.log(e.target);
    const nickname = e.target.value;
    this.setState({ nickname: nickname });
  };

  progressHandler = (e) => {
    let percent = Math.round((e.loaded / e.total) * 100);
    if (percent !== null) {
      this.setState.percentage = percent;
    }
  };

  clearForm = () => {
    document.getElementById("docTitle").value = null;
    document.getElementById("docDesc").value = null;
    document.getElementById("docFileInput").value = null;
    document.getElementById("docFile").value = null;
    this.setState({ tags: [] });
  };

  fileUpload = () => {
    document.getElementById("docFile").click();
  };

  handleChange = (e) => {
    const file = e[0];
    let filename = file.name;
    let filesize = file.size;
    let ext = filename.substring(filename.lastIndexOf(".") + 1, filename.length).toLowerCase();
    this.setState({
      fileInfo: {
        file: file,
        size: filesize,
        ext: ext,
        filename: filename
      }
    });
  };

  clearFileInfo = () => {
    this.setState({
      fileInfo: {
        file: null,
        size: -1,
        ext: null,
        owner: null,
        title: null,
        filename: null
      }
    });
  };

  autocompleteRenderInput = ({ addTag, ...props }) => {
    const handleOnChange = (e, { newValue, method }) => {
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
      <Autosuggest
        ref={props.ref}
        suggestions={suggestions}
        shouldRenderSuggestions={(value) => value && value.trim().length > 0}
        getSuggestionValue={(suggestion) => suggestion}
        renderSuggestion={(suggestion) => <span key={suggestion.value}>{suggestion._id}</span>}
        inputProps={{ ...props, onChange: handleOnChange }}
        onSuggestionSelected={(e, { suggestion }) => {
          addTag(suggestion);
        }}
        onSuggestionsClearRequested={() => {
        }}
        onSuggestionsFetchRequested={() => {
        }}
      />
    );
  };


  render() {
    return (
      <span>
            <div className="upload-btn d-none d-sm-inline-block" onClick={() => this.handleClickOpen("classicModal")}>
              <i className="material-icons">cloud_upload</i>
              Upload
            </div>
        {this.props.type && this.props.type === 'menu' &&
        <span className="d-inline-block d-sm-none" onClick={() => this.handleClickOpen("classicModal")}>Upload</span>
        }

            <Dialog
              fullWidth={this.state.fullWidth}
              open={this.state.classicModal}
              TransitionComponent={Transition}
              keepMounted
              aria-labelledby="classic-modal-slide-title"
              aria-describedby="classic-modal-slide-description">


              <DialogTitle
                id="classic-modal-slide-title"
                disableTypography>
                <i className="material-icons modal-close-btn" onClick={() => this.handleClose("classicModal")}>close</i>
                <h3 >Upload document</h3>
              </DialogTitle>


              <DialogContent id="classic-modal-slide-description" >
                <div className="dialog-subject">Title</div>
                <input type="text" placeholder="Title of the uploading document" id="docTitle"
                       className="custom-input"/>


                <div className="dialog-subject">Description</div>
                <textarea id="docDesc" className="custom-input"/>


                <div className="dialog-subject">File</div>
                <input type="text" value={this.state.fileInfo.filename || ""} readOnly
                       placeholder="Click here to upload document" id="docFileInput" className="custom-input-file"
                       onClick={this.fileUpload}/>
                <input type="file" id="docFile" onChange={(e) => this.handleChange(e.target.files)}/>


                <div className="dialog-subject mb-1">Tag</div>
                <TagsInput id="tags" renderInput={this.autocompleteRenderInput}
                           value={this.state.tags} onChange={this.onChangeTag} validate={this.validateTag} onlyUnique/>
              </DialogContent>


              <DialogActions className="modal-footer">
                <div onClick={() => this.handleClose("classicModal")} className="cancel-btn">Cancel</div>
                <div onClick={() => this.onUploadDoc()} className="ok-btn">Upload</div>
              </DialogActions>
              <div className="progress-modal" id="progressModal">
                <div className="progress-modal-second">
                  <span className="progress-percent">{this.state.percentage}%</span>
                  <img src={require("assets/image/common/g_progress_circle.gif")} alt="progress circle"/>
                </div>
              </div>
            </Dialog>
      </span>
    );
  }
}

export default UploadDocument;
