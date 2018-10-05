import React from 'react'
import axios, { get, post, put } from 'axios';
import * as restapi from '../apis/DocApi';
import ReadString from "../ReadString";
import SetString from "../SetString";
class SimpleReactFileUpload extends React.Component {
  state = {
    fileInfo: {
      file: null,
      size:-1,
      ext:null,
      owner:null
    },
    stackId: null
  }

  onFormSubmit = (e) => {
    e.preventDefault() // Stop form submit

    this.registDocumentToSmartContract({documentId:"00e89f6da7d84344baede6899fa110b7"}); return;


    if(!this.state.fileInfo || !this.state.fileInfo.file){
      alert("Please select a document file");
    } else {
      console.log("Selected a document file", this.state.fileInfo);
      const res = restapi.registDocument({
          fileInfo: this.state.fileInfo,
          userInfo: this.props.auth.getUserInfo()
        }, (result, err) => {
          if(err){
            alert(err.message);
          } else {
            this.registDocumentToSmartContract(result);
          }
          console.log("Regist Document End", result);
          this.clearForm();
          this.clearFileInfo();
      });
    }

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
    document.getElementById("frmUploadFile").reset();
  }

  clearFileInfo = () => {
    this.setState({fileInfo:null});
  }

  registDocumentToSmartContract = (result) => {

    if(!result || !result.documentId){
      alert("documentId is nothing");
      return;
    }
    const { drizzle, drizzleState, auth } = this.props;
    const documentId = result.documentId;
    const contract = drizzle.contracts.DocumentRegistry;
    const account = drizzleState.accounts[0];

    console.log("registSmartContractAddress", drizzle, drizzleState, contract, account, result);

    const stackId = contract.methods["registerDocument"].cacheSend(drizzle.web3.utils.fromAscii(documentId), {
      from: account
    });

    // save the `stackId` for later reference
    this.setState({ stackId });
  };

  getTxStatus = () => {
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = this.props.drizzleState;

    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackId];

    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;
    console.log("getTxStatus", txHash, transactions, transactions[txHash].status);
    // otherwise, return the transaction status
    return `Transaction status: ${transactions[txHash].status}`;
  };


  componentDidMount() {
    const { drizzle, drizzleState, auth } = this.props;
    if(!auth.isAuthenticated()){
      auth.login();
      return "Loading";
    }
  }

  render() {
    const { drizzle, drizzleState, auth } = this.props;
    return (
      <div className="App">
        <form id="frmUploadFile" onSubmit={this.onFormSubmit}>
          <h1>Upload Document</h1>
          <input type="file" onChange={this.onChange} />
          <button type="submit">Upload</button>
        </form>
        <div>{this.getTxStatus()}</div>

          <ReadString
            drizzle={drizzle}
            drizzleState={drizzleState}
          />

          <SetString
            drizzle={drizzle}
            drizzleState={drizzleState}
          />
      </div>
    )
  }
}

export default SimpleReactFileUpload
