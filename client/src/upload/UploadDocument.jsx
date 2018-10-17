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

import { Close, CloudUpload } from "@material-ui/icons";
import javascriptStyles from "assets/jss/material-kit-react/views/componentsSections/javascriptStyles.jsx";

import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.
import * as restapi from 'apis/DocApi';
import DrizzleApis from 'apis/DrizzleApis';



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

    this.drizzleApis = new DrizzleApis(props.dirzzle);

    this.state = {
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
      tags: []
    };
  }

  handleClickOpen = (modal) => {

    const { auth } = this.props;
    console.log(this.props)
    if(!auth.isAuthenticated()){
      auth.login();
      return "Loading";
    } else {
      var x = [];
      x[modal] = true;
      this.setState(x);
    }


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

  handleTagChange = (tags) => {
    this.setState({tags})
  }


  onRegistDoc = () => {
    const { drizzle, drizzleState, auth } = this.props;
    const self = this;
    if(!drizzle || !drizzleState || !auth){
      console.error("dirzzle or auth object is invalid",  drizzle, drizzleState, auth);
      alert('dirzzle or auth object is invalid');
      return;
    }


    const fileInfo = this.state.fileInfo;
    const tags = this.state.tags?this.state.tags:[];
    const title = document.getElementById("title").value;
    const desc = document.getElementById("desc").value;
    const userInfo = this.props.auth.getUserInfo();

    if(!this.state.fileInfo || !this.state.fileInfo.file){
      alert("Please select a document file", drizzle, auth);
      return;
    }

    if(!drizzleState.drizzleStatus.initialized){
      alert("Please connect to Metamask...(Metamask Account is invalid)");
      return;
    }
    const ethAccount = drizzleState.accounts[0];
    console.log("Selected a document file", this.state.fileInfo);
    restapi.registDocument({
        fileInfo: fileInfo,
        userInfo: userInfo,
        ethAccount: ethAccount,
        title: title,
        desc: desc,
        tags:tags
      }).then((result) => {
        console.log("UploadDocument", result);
        //this.registDocumentToSmartContract(result);
        const drizzleApis = new DrizzleApis(drizzle);
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

  clearForm = () => {
    document.getElementById("title").value=null;
    document.getElementById("desc").value=null;
    document.getElementById("file").value=null;
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

  setValue = value => {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.MyStringStore;

    // let drizzle know we want to call the `set` method with `value`
    const stackId = contract.methods["set"].cacheSend(value, {
      from: drizzleState.accounts[0]
    });

    // save the `stackId` for later reference
    this.setState({ stackId });
  };

  getTxStatus = () => {
    const { drizzle, drizzleState } = this.props;
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = this.props.drizzleState;

    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackId];

    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;
    console.log("getTxStatus", txHash, transactions, transactions[txHash].status, drizzleState, drizzle);
    // otherwise, return the transaction status
    const txStatus = transactions[txHash].status;
    const txReceipt = transactions[txHash].receipt;
    if(txReceipt){
      console.log("Transcation Complete", txReceipt);
      this.setState({stackId:null});
    }

    return `Transaction status: ${transactions[txHash].status}`;
  };




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


                <TagsInput id="tags" value={this.state.tags} onChange={this.handleTagChange} />

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
