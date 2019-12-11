import React from "react";
import UploadDocumentModalContainer from "../../../container/common/modal/UploadDocumentModalContainer";
import UploadCompleteModalContainer from "../../../container/common/modal/UploadCompleteModalContainer";
import DollarLearnMoreModal from "../../../container/common/modal/DollarLearnMoreModalContainer";
import PublishModalContainer from "../../../container/common/modal/PublishModalContainer";
import PublishCompleteModalContainer from "../../../container/common/modal/PublishCompleteModalContainer";
import ImageCropModalContainer from "../../../container/common/modal/ImageCropModalContainer";
import DepositModalContainer from "../../../container/common/modal/DepositModalContainer";
import WithdrawModalContainer from "../../../container/common/modal/WithdrawModalContainer";
import AsyncWalletModalContainer from "../../../container/common/modal/AsyncWalletModalContainer";

class ModalList extends React.Component {

  render() {
    return {
      // 문서 업로드 모달
      "upload": <UploadDocumentModalContainer/>,

      // 업로드 완료 모달
      "uploadComplete": <UploadCompleteModalContainer/>,

      // 달러 정책 설명 모달
      "dollarLearnMore": <DollarLearnMoreModal/>,

      // 문서 출판 모달
      "publish": <PublishModalContainer/>,

      // 문서 출판 완료 모달
      "publishComplete": <PublishCompleteModalContainer/>,

      // 이미지 자르기 모달
      "imageCrop": <ImageCropModalContainer/>,

      // 입금 모달
      "deposit": <DepositModalContainer/>,

      // 입금 모달
      "withdraw": <WithdrawModalContainer/>,

      // 지갑 연동 모달
      "async": <AsyncWalletModalContainer/>

    }[this.props.getModalCode] || <div/>;
  }
}

export default ModalList;
