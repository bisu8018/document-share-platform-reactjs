import React from "react";
import UploadDocumentModalContainer from "../../../container/common/modal/UploadDocumentModalContainer";
import UploadCompleteModalContainer from "../../../container/common/modal/UploadCompleteModalContainer";
import DollarLearnMoreModal from "../../../container/common/modal/DollarLearnMoreModalContainer";
import PublishModalContainer from "../../../container/common/modal/PublishModalContainer";
import PublishCompleteModalContainer from "../../../container/common/modal/PublishCompleteModalContainer";

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

      case "publish":
        return <PublishModalContainer/>;

      case "publishComplete":
        return <PublishCompleteModalContainer/>;

      default:
        return <div/>
    }
  }
}

export default ModalList;
