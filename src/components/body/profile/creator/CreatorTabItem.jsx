import React from "react";
import { Link } from "react-router-dom";
import Common from "../../../../common/common";
import CreatorClaimContainer from "../../../../container/body/profile/creator/CreatorClaimContainer";
import { FadingCircle } from "better-react-spinkit";
import Tooltip from "@material-ui/core/Tooltip";
import LinesEllipsis from "react-lines-ellipsis";
import responsiveHOC from "react-lines-ellipsis/lib/responsiveHOC";
import PayoutCard from "../../../common/card/PayoutCard";
import CopyModalContainer from "../../../../container/common/modal/CopyModalContainer";
import DeleteDocumentModalContainer from "../../../../container/common/modal/DeleteDocumentModalContainer";
import MainRepository from "../../../../redux/MainRepository";
import RegBlockchainBtnContainer from "../../../../container/body/contents/contentsView/RegBlockchainBtnContainer";
import DocumentInfo from "../../../../redux/model/DocumentInfo";
import common_view from "../../../../common/common_view";
import { psString } from "../../../../config/localization";
import { APP_PROPERTIES } from "../../../../properties/app.properties";


const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

class CreatorTabItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      documentData: new DocumentInfo(),
      completeModalOpen: false
    };
  }


  // 초기화
  init = () => {
    this.setDocumentData().then(() => this.handleState());
  };


  // 리워드 정보 표시
  showRewardInfo = (id) => {
    if (document.getElementById(id)) document.getElementById(id).style.display = "block";
  };


  // 리워드 정보 숨김
  hideRewardInfo = (id) => {
    if (document.getElementById(id)) document.getElementById(id).style.display = "none";
  };


  // 클릭 이벤트 리스너
  clickEventListener = () => {
    const { idx } = this.props;

    document.addEventListener("click", e => {
        let targetElement = e.target;

        // 뷰어페이지 옵션창
        const viewerOptionBtn = document.getElementById("viewer-option-btn-" + idx),
          viewerOptionTable = document.getElementById("viewer-option-table-" + idx),
          viewerOptionIcon = document.getElementById("view-option-icon-" + idx);

        if (viewerOptionBtn && !viewerOptionBtn.contains(targetElement)) {
          viewerOptionTable.classList.add("d-none");
          viewerOptionIcon.classList.remove("d-inline-block");
        }
      }
    );
  };


  //문서 다운로드
  getContentDownload = (accountId, documentId, documentName) => {

    MainRepository.Document.getDocumentDownloadUrl({ documentId: documentId }).then(result => {
      const a = document.createElement("a");

      a.style.display = "none";
      document.body.appendChild(a);
      a.href = result.downloadUrl;
      a.setAttribute("download", documentName);
      a.click();

      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    }).catch(err => console.error(err));
  };


  // 문서 정보 state 저장
  setDocumentData = () => {
    if (!this.state.documentData.seoTitle)
      return new Promise(resolve => {
        this.setState({ documentData: this.props.document }, () => {
          resolve();
        });
      });
  };


  // document state 관리
  setDocumentState = (state) => {
    let _documentData = this.state.documentData;
    _documentData.state = state;
    this.setState({ documentData: _documentData });
  };


  //  문서 정보 state 의 isRegistry 업데이트
  setIsRegistry = () => {
    return new Promise(resolve => {
      let _documentData = this.state.documentData;
      _documentData.isRegistry = true;
      this.setState({ _documentData: _documentData }, () => {
        resolve();
      });
    });
  };


  // 체인 등록 완료 후 관리
  handleAfterRegistered = () => this.setIsRegistry();


  //문서 다운로드 전 데이터 SET
  handleDownloadContent = () => {
    const { getMyInfo, setAlertCode } = this.props;
    const { documentData } = this.state;

    if (!documentData) return setAlertCode(2091);
    if (!MainRepository.Account.isAuthenticated() && !getMyInfo.email) return setAlertCode(2003);

    const accountId = documentData.accountId,
      documentId = documentData.documentId,
      documentName = documentData.documentName;

    this.getContentDownload(accountId, documentId, documentName);
  };


  // display: inline-block 추가
  addInlineBlock = e => Promise.resolve(e.target.classList.add("d-inline-block"));


  // 문서 상태관리
  handleState = () => {
    const { setAlertCode } = this.props;
    const { documentData } = this.state;

    if (documentData.accountId !== common_view.getMySub() || !documentData.state || documentData.state === "CONVERT_COMPLETE") return false;

    this.setInterval = setInterval(() => {
      MainRepository.Document.getDocument(documentData.seoTitle)
        .then(res => {
          if (res && res.document.state === "CONVERT_COMPLETE") {
            clearInterval(this.setInterval);
            this.setDocumentState(res.document.state);
            setAlertCode(2075, { title: documentData.title });
          }
        })
        .catch(() => {
          clearInterval(this.setInterval);
          setAlertCode(2001);
        });
    }, 5000);
  };


  componentWillMount(): void {
    this.init();
  }


  render() {
    const { getCreatorDailyRewardPool, handleUploadSettings, totalViewCountInfo, getIsMobile, viewerOptionOpenedIdx, idx, setModal } = this.props;
    const { documentData } = this.state;

    if (!documentData.seoTitle) return false;

    let reward = Common.toEther(common_view.getAuthorNDaysReward(documentData, getCreatorDailyRewardPool, totalViewCountInfo, 7)),
      vote = Common.toEther(documentData.latestVoteAmount) || 0,
      view = documentData.latestPageview || 0,
      identification = documentData.author ? (documentData.author.username && documentData.author.username.length > 0 ? documentData.author.username : documentData.author.email) : documentData.accountId;

    return (

      <div className="row u_center_inner">
        <div className="pl-0 col-12 col-sm-3 col-lg-2 col-thumb">
          <div className="tab-thumbnail" onClick={() => common_view.scrollTop()}>
            {documentData.state && documentData.state !== "CONVERT_COMPLETE" ?
              <Tooltip title="Converting document..." placement="bottom">
                <div className="not-convert-container">
                  <div className="not-convert"><FadingCircle size={40} color={"#3d5afe"}/></div>
                </div>
              </Tooltip> :
              <Link to={"/@" + identification + "/" + documentData.seoTitle} rel="nofollow">
                <img src={Common.getThumbnail(documentData.documentId, "thumb", 1, documentData.documentName)}
                     alt={documentData.title ? documentData.title : documentData.documentName}
                     className={"main-category-card-img " + (documentData.state && documentData.state !== "CONVERT_COMPLETE" ? " not-convert-background" : "")}/>
              </Link>
            }
          </div>
        </div>


        <div className="col-12 col-sm-9 col-lg-10 p-0">
          {documentData.accountId === common_view.getMySub() &&
          <div className="view-option-btn">
            <i className={"material-icons " + (viewerOptionOpenedIdx === idx ? "d-inline-block" : "")}
               onClick={e => handleUploadSettings()}>more_vert</i>

            <div className={"option-table " + (viewerOptionOpenedIdx === idx ? "" : "d-none")} id={"optionTable" + idx}>
              {documentData.state === "CONVERT_COMPLETE" && documentData.isPublic === true &&
              <CopyModalContainer documentData={documentData} type="onlyIcon"/>}

              {documentData.state === "CONVERT_COMPLETE" &&
              <div className="option-table-btn" onClick={() => this.handleDownloadContent()}>
                <i className="material-icons">save_alt</i>
                {psString("download-btn")}
              </div>}

              {((Common.dateAgo(documentData.created) > 0 && documentData.state && documentData.state !== "CONVERT_COMPLETE") || documentData.isRegistry === false) &&
              <DeleteDocumentModalContainer documentData={documentData} type="onlyIcon"/>}
            </div>
          </div>}

          <Link to={"/@" + identification + "/" + documentData.seoTitle} rel="nofollow"
                className={(documentData.state && documentData.state !== "CONVERT_COMPLETE" ? " not-convert-wrapper" : "")}>
            <div className="info_title mb-1" onClick={() => common_view.scrollTop()}>
              {documentData.title ? documentData.title : documentData.documentName}
            </div>
          </Link>

          <div className="details-info-desc-wrapper">
            {documentData.desc && documentData.state === "CONVERT_COMPLETE" &&
            <Link to={"/@" + identification + "/" + documentData.seoTitle}
                  className="info_desc " rel="nofollow"
                  title="description" onClick={() => common_view.scrollTop()}>
              <ResponsiveEllipsis
                text={documentData.desc}
                maxLine={2}
                ellipsis='...'
                trimRight
                basedOn='words'/>
            </Link>}
          </div>


          <div className="tab-item-info-wrapper ">
              <span className={"info-detail-reward mr-3 " + (documentData.isRegistry ? "" : "color-not-registered")}
                    onMouseOver={() => this.showRewardInfo(documentData.seoTitle + "reward")}
                    onMouseOut={() => this.hideRewardInfo(documentData.seoTitle + "reward")}>
                $ {Common.deckToDollar(reward)}
                <img className="reward-arrow"
                     src={APP_PROPERTIES.domain().static + "/image/icon/i_arrow_down_" + (documentData.isRegistry ? "blue" : "grey") + ".svg"}
                     alt="arrow button"/>
              </span>

            {reward > 0 && <PayoutCard reward={reward} data={documentData}/>}
            <span className="info-detail-view mr-3">{view}</span>
            <span className="info-detail-vote mr-3">{Common.deckStr(vote)}</span>
            <div className="info-date ml-0 ml-sm-3">{common_view.dateTimeAgo(documentData.created)}</div>

            <div className={"claim-btn-wrapper " + (getIsMobile ? "mt-2" : "float-right")}>
              <CreatorClaimContainer {...this.props} document={documentData}/>
            </div>

            {documentData.isPublic === false && documentData.state === "CONVERT_COMPLETE" &&
            <div className={(getIsMobile ? "mt-2" : "float-right")}>
              <Tooltip title={psString("tooltip-publish")} placement="bottom">
                <div className={"claim-btn " + (getIsMobile ? " w-100" : "")}
                     onClick={() => setModal("publish", { documentData: documentData })}>
                  {psString("common-modal-publish")}
                </div>
              </Tooltip>
            </div>}

            {documentData.isPublic && (documentData.accountId === common_view.getMySub() && documentData) &&
            <div className={(getIsMobile ? "mt-2" : "float-right")}>
              <RegBlockchainBtnContainer documentData={documentData} type={"tabItem"}
                                         afterRegistered={() => this.handleAfterRegistered()}/>
            </div>}
          </div>
        </div>
      </div>
    );
  }

}

export default CreatorTabItem;
