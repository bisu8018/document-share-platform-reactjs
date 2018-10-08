import React from 'react'
import axios, { get, post, put } from 'axios';
import * as restapi from '../apis/DocApi';
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

  onClick = (e) => {
    console.log("click");
    //this.setValue("t" + new Date()); return;

    this.registDocumentToSmartContract({documentId:"a32539cb30eb40f2b50d995636b79c8a"});
  }

  onFormSubmit = (e) => {
    e.preventDefault() // Stop form submit

    if(!this.state.fileInfo || !this.state.fileInfo.file){
      alert("Please select a document file");
    } else {
      const { drizzle, drizzleState, auth } = this.props;
      const account = drizzleState.accounts[0];

      console.log("Selected a document file", this.state.fileInfo, "eth account", account);
      const res = restapi.registDocument({
          fileInfo: this.state.fileInfo,
          userInfo: this.props.auth.getUserInfo(),
          account: account,
          //tags:['BlockChain', 'ConsenSys']
        }, (result, err) => {
          if(err){
            alert("Regist Document Fail : " + JSON.stringify(err.detail));
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
    const { drizzle, drizzleState, auth } = this.props;
    if(!result || !result.documentId){
      alert("documentId is nothing");
      return;
    }

    const documentId = result.documentId;
    const account = drizzleState.accounts[0];

    const contract = drizzle.contracts.DocumentRegistry;
    const stackId = contract.methods["registerDocument"].cacheSend(drizzle.web3.utils.fromAscii(documentId), {
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
    const { drizzle, drizzleState, auth } = this.props;
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


  componentDidMount() {
    const { drizzle, drizzleState, auth } = this.props;
    if(!auth.isAuthenticated()){
      auth.login();
      return "Loading";
    }
  }

  render() {
    const { drizzle, drizzleState, auth } = this.props;
    if(!auth.isAuthenticated()) return "Loading";

    return (
      <div className="App">
        <form id="frmUploadFile" onSubmit={this.onFormSubmit}>
          <h1>Upload Document</h1>
          <input type="file" onChange={this.onChange} />
          <button type="submit">Upload</button>
        </form>
        <div>{this.getTxStatus()}</div>
      </div>
    )
  }
}

export default SimpleReactFileUpload
