import React from "react";
import UploadDocumentModalContainer from "../../../container/common/modal/UploadDocumentModalContainer";
import UploadCompleteModalContainer from "../../../container/common/modal/UploadCompleteModalContainer";
import DollarLearnMoreModal from "../../../container/common/modal/DollarLearnMoreModalContainer";

class ModalList extends React.Component {

  render() {
    const {getModalCode} = this.props;

    switch (getModalCode) {
      case "upload":
        return <UploadDocumentModalContainer/>;

      case "uploadComplete":
        return <UploadCompleteModalContainer/>;

      case "dollarLearnMore":
        return <DollarLearnMoreModal/>;

      default:
        return <div/>
    }
  }
}

export default ModalList;
