import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomDropdown from 'components/CustomDropdown/CustomDropdown.jsx';
import Badge from 'components/Badge/Badge.jsx';

import { Close, CloudUpload } from "@material-ui/icons";
import javascriptStyles from "assets/jss/material-kit-react/views/componentsSections/javascriptStyles.jsx";

import Autosuggest from 'react-autosuggest'
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.
import * as restapi from 'apis/DocApi';
import DrizzleApis from 'apis/DrizzleApis';



function Transition(props) {
  return <Slide direction="down" {...props} />;
}

const categories = [
  "Art & Photos", "Automotive", "Business", "Career", "Data & Analytics", "Design", "Devices & Hardware", "Design",
  "Devices & Hardware", "Economy & Finance", "Education", "Engineering", "Entertainment & Humor", "Environment", "Food",
  "Government & Nonprofit", "Health & Medicine", "Healthcare", "Engineering", "Internet", "Investor Relations", "Law",
  "Leadership & Management", "Lifestyle", "Marketing", "Mobile", "News & Politics", "Presentations & Public Speaking", "Real Estate",
  "Recruiting & HR", "Retail", "Sales", "Science", "Self Improvement", "Services", "Small Business & Entrepreneurship", "Social Media",
  "Software", "Spiritual", "Sports", "Technology", "Travel"
]

class UploadDocument extends React.Component {

  anchorElLeft = null;
  anchorElTop = null;
  anchorElBottom = null;
  anchorElRight = null;

  constructor(props) {
    super(props);

    this.state = {
      nickname: "",
      classicModal: false,
      openLeft: false,
      openTop: false,
      openBottom: false,
      openRight: false,
      fileInfo: {
        file: null,
        size:-1,
        ext:null,
        owner:null
      },
      stackId: null,
      tags: [],
      category: null
    };
  }

  setNickname = (nickname) => {
    //console.log("clear session", localStorage);
    localStorage.setItem('nickname', nickname);
  }

  getNickname = () => {
    //console.log("clear session", localStorage);
    return localStorage.getItem('nickname');
  }

  handleClickOpen = (modal) => {

    const { drizzleApis} = this.props;

    const account = drizzleApis.getLoggedInAccount();
    this.setState({nickname: account});

    /*
    if(!auth.isAuthenticated()){
      auth.login();
      return "Loading";
    } else {
      var x = [];
      x[modal] = true;
      this.setState(x);
    }
    */
    var x = [];
    x[modal] = true;
    this.setState(x);

  }
  handleClose = (modal) => {
    var x = [];
    x[modal] = false;
    this.setState(x);
    this.clearForm();
    this.clearFileInfo();
  }
  handleClosePopover = (state) => {
    this.setState({
      [state]: false
    });
  }
  handleClickButton = (state) => {
    this.setState({
      [state]: true
    });
  }

  onChangeTag = (tags) => {

    this.setState({tags})
  }


  onRegistDoc = () => {
    const { drizzleApis } = this.props;
    const self = this;
    if(!drizzleApis.isAuthenticated()){
      alert('dirzzle is not Authenticated');
      return;
    }

    const fileInfo = this.state.fileInfo;
    const tags = this.state.tags?this.state.tags:[];
    const title = document.getElementById("title").value;
    const desc = document.getElementById("desc").value;
    const nickname = document.getElementById("nickname").value;
    const userInfo = {nickname: nickname};//this.props.auth.getUserInfo();

    if(!this.state.fileInfo || !this.state.fileInfo.file){
      alert("Please select a document file");
      return;
    }

    const ethAccount = drizzleApis.getLoggedInAccount();
    console.log("Selected a Document File", this.state.fileInfo);
    restapi.registDocument({
        fileInfo: fileInfo,
        userInfo: userInfo,
        ethAccount: ethAccount,
        title: title,
        desc: desc,
        tags:tags
      }, this.progressHandler).then((result) => {
        console.log("UploadDocument", result);
        //this.registDocumentToSmartContract(result);
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
  }

  onChangeNickname = (e) => {
    console.log(e.target);
    const nickname = e.target.value;
    this.setState({nickname: nickname});
  }

  onChangeCategory = (e) => {
    console.log(e.target);
    const nickname = e.target.value;
    this.setState({nickname: nickname});
  }

  onChange = (e) => {

    const file = e.target.files[0];
    console.log("onChange", file);

    let filename = file.name;
    let filesize = file.size;
    let ext  = filename.substring(filename.lastIndexOf(".") + 1, filename.length).toLowerCase();

    //console.log(filename, filesize, ext);
    this.setState({fileInfo: {
      file: file,
      size: filesize,
      ext: ext
    }});
  }

  progressHandler = (e) => {
    var percent = Math.round((e.loaded / e.total) * 100);
    if (percent !== null) {
      if (percent < 100) {
        document.getElementById("uploadProgress").value = percent;
        document.getElementById("uploadStatus").innerHTML = percent + "% uploaded... please wait";
      } else {
        document.getElementById("uploadStatus").innerHTML = "100% uploaded!";
      }
    }
  }

  clearForm = () => {
    document.getElementById("title").value=null;
    document.getElementById("desc").value=null;
    document.getElementById("file").value=null;
    document.getElementById("nickname").value=null;
    document.getElementById("uploadStatus").innerHTML = null;
    this.setState({tags:[]});
  }

  clearFileInfo = () => {
    this.setState({fileInfo:null});
  }

  registDocumentToSmartContract = (result) => {
    const { drizzle, drizzleState} = this.props;
    if(!result || !result.documentId){
      alert("documentId is nothing");
      return;
    }

    const documentId = result.documentId;
    const account = drizzleState.accounts[0];

    const contract = drizzle.contracts.DocumentRegistry;
    const stackId = contract.methods["register"].cacheSend(drizzle.web3.utils.fromAscii(documentId), {
      from: account
    });
    console.log("registSmartContractAddress", drizzle, drizzleState, contract, account, result);
    // save the `stackId` for later reference
    this.setState({ stackId });
  };


  validateTag = (tag) => {
    //console.log(tag);
    return false;

  }


  autocompleteRenderInput =({addTag, ...props}) => {
        const handleOnChange = (e, {newValue, method}) => {
          if (method === 'enter') {
            e.preventDefault()
          } else {
            props.onChange(e)
          }
        }

        const inputValue = (props.value && props.value.trim().toLowerCase()) || ''
        const inputLength = inputValue.length

        let suggestions = categories.filter((categories) => {
          return categories.toLowerCase().slice(0, inputLength) === inputValue
        })

        return (
          <Autosuggest
            ref={props.ref}
            suggestions={suggestions}
            shouldRenderSuggestions={(value) => value && value.trim().length > 0}
            getSuggestionValue={(suggestion) => suggestion}
            renderSuggestion={(suggestion) => <span>{suggestion}</span>}
            inputProps={{...props, onChange: handleOnChange}}
            onSuggestionSelected={(e, {suggestion}) => {
              addTag(suggestion)
            }}
            onSuggestionsClearRequested={() => {}}
            onSuggestionsFetchRequested={() => {}}
          />
        )
      }


  render() {
    const { classes  } = this.props;

    return (
        <span>
            <Button href="#" color="transparent"  onClick={() => this.handleClickOpen("classicModal")} ><CloudUpload className={classes.icons} /> Upload</Button>
            <Dialog
              classes={{
                root: classes.center,
                paper: classes.modal
              }}
              open={this.state.classicModal}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => this.handleClose("classicModal")}
              aria-labelledby="classic-modal-slide-title"
              aria-describedby="classic-modal-slide-description">
              <DialogTitle
                id="classic-modal-slide-title"
                disableTypography
                className={classes.modalHeader}>
                <IconButton
                  className={classes.modalCloseButton}
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  onClick={() => this.handleClose("classicModal")}>
                  <Close className={classes.modalClose} />
                </IconButton>
                <h4 className={classes.modalTitle}>Upload a document</h4>
              </DialogTitle>
              <DialogContent
                id="classic-modal-slide-description"
                className={classes.modalBody}>

                <CustomInput
                  labelText="Nickname"
                  id="nickname"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: "labelText",
                    value: this.state.nickname,
                    onChange: this.onChangeNickname
                  }} />
                {/*
                  <CustomDropdown
                    buttonText="Category"
                    dropdownList={categories}
                    buttonProps={{
                      onChange: this.onChangeCategory
                    }}
                  />
                  */}
                <CustomInput
                  labelText="Title"
                  id="title"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: "labelText"
                  }} />

                  <CustomInput
                   labelText="Description"
                   id="desc"
                   formControlProps={{
                     fullWidth: true,
                     className: classes.textArea
                   }}
                   inputProps={{
                     multiline: true,
                     rows: 5 }} />

                <CustomInput
                  labelText="file"
                  id="file"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: "file",
                    onChange: this.onChange
                  }} />

                <progress class="uploadProgress" id="uploadProgress" value="0" max="100" width={300}></progress>
                <div class="uploadStatus" id="uploadStatus"></div>

                <TagsInput id="tags" renderInput={this.autocompleteRenderInput}
                  value={this.state.tags} onChange={this.onChangeTag} validate={this.validateTag} onlyUnique />

              </DialogContent>
              <DialogActions className={classes.modalFooter}>
                <Button onClick={() => this.onRegistDoc()} color="rose"  size="sm">Ok</Button>
                <Button onClick={() => this.handleClose("classicModal")} size="sm">Close</Button>
              </DialogActions>
            </Dialog>
        </span>
    );
  }
}

export default withStyles(javascriptStyles)(UploadDocument);
