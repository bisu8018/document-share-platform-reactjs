import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { psString } from "../../config/localization";

class DropZone extends Component {
  constructor() {
    super();
    this.onDrop = file => {
      if (this.state.file !== file) this.setState({ file }, () => this.props.handleFileChange(file));
    };
    this.onDragLeave = () => {
      if (this.state.dragOver) this.setState({ dragOver: false });
    };
    this.onDragOver = () => {
      if (!this.state.dragOver) this.setState({ dragOver: true });
    };
    this.state = {
      file: [],
      dragOver: false
    };
  }


  render() {
    const { file, dragOver } = this.state;
    const { fileInfoError, getIsMobile } = this.props;

    const _files = file.map(file => (
      <div key={file.name}>
        <div className="custom-dropzone-document-info">{file.name}</div>
      </div>
    ));

    return (
      <Dropzone onDrop={this.onDrop} onDragOver={this.onDragOver} onDragLeave={this.onDragLeave}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps({ className: "dropzone custom-dropzone mt-4 " + (fileInfoError.length > 0 ? "tag-input-warning " : "") + (dragOver && "custom-dropzone-over") })}>
            <input {...getInputProps()} />
            {file.length > 0 ?
              <div>{_files}</div> :
              <div className='p-3'>
                  <i className="material-icons">cloud_upload</i>
                  <div>{getIsMobile ? psString("content-add-click") : psString("content-add-drag-drop")}</div>
                <div/>
              </div>}
          </div>)}
      </Dropzone>
    );
  }
}

export default DropZone;
