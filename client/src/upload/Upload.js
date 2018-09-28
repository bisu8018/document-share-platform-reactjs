import React from 'react'
import axios, { get, post, put } from 'axios';
import * as restapi from '../apis/DocApi';

class SimpleReactFileUpload extends React.Component {
  state = {
    file: {
      data: null,
      size:-1,
      ext:null,
      owner:null
    }
  }

  constructor(props) {
    super(props);

    //this.onFormSubmit = this.onFormSubmit.bind(this)
    //this.onChange = this.onChange.bind(this)
    //this.fileUpload = this.fileUpload.bind(this)
  }
  onFormSubmit = (e) => {
    e.preventDefault() // Stop form submit
    console.log("onFormSubmit", this.state.file);
    const res = restapi.registDocument(this.state.file, (result) => {
      this.clearForm();
      this.clearFileInfo();
    });
  }

  onChange = (e) => {

    const file = e.target.files[0];
    console.log("onChange", file);

    let filename = file.name;
    let filesize = file.size;
    let ext  = filename.substring(filename.lastIndexOf(".") + 1, filename.length).toLowerCase();

    console.log(filename, filesize, ext);
    this.setState({file: {
      data: file,
      size: filesize,
      ext: ext
    }});
  }

  clearForm = () => {
    document.getElementById("frmUploadFile").reset();
  }

  clearFileInfo = () => {
    this.setState({file:null});
  }

  render() {
    console.log(JSON.stringify(this.state));
    return (
      <form id="frmUploadFile" onSubmit={this.onFormSubmit}>
        <h1>File Upload</h1>
        <input type="file" onChange={this.onChange} />
        <button type="submit">Upload</button>
      </form>
   )
  }
}



export default SimpleReactFileUpload
