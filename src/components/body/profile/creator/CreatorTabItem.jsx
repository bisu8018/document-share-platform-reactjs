import React from "react";
import { Link } from "react-router-dom";
import Common from "../../../../common/common";
import CreatorClaimContainer from "../../../../container/body/profile/creator/CreatorClaimContainer";
import { FadingCircle } from "better-react-spinkit";
import Tooltip from "@material-ui/core/Tooltip";
import LinesEllipsis from "react-lines-ellipsis";
import PayoutCard from "../../../common/card/PayoutCard";
import CopyModalContainer from "../../../../container/common/modal/CopyModalContainer";
import DeleteDocumentModalContainer from "../../../../container/common/modal/DeleteDocumentModalContainer";
import PublishModalContainer from "../../../../container/common/modal/PublishModalContainer";
import MainRepository from "../../../../redux/MainRepository";
import RegBlockchainBtnContainer from "../../../../container/body/contents/contentsView/RegBlockchainBtnContainer";
import DocumentInfo from "../../../../redux/model/DocumentInfo";
import common_view from "../../../../common/common_view";
import PublishCompleteModalContainer from "../../../../container/common/modal/PublishCompleteModalContainer";


class CreatorTabItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ratio: null,
      documentData: new DocumentInfo(),
      completeModalOpen: false
    };
  }


  // 초기화
  init = () => {
    this.clickEventListener();
    this.setDocumentData()
      .then(() => this.handleState())
      .then(() => this.getImgInfo());
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


  // 등록 버튼 트리거
  triggerRegisterBtn = () => {
    let ele = document.getElementById("RegBlockchainBtnTab");
    if (!ele) return false;
    else ele.click();
  };


  // 이미지 정보 GET
  getImgInfo = () => {
    const { documentData } = this.state;
    let imgUrl = Common.getThumbnail(documentData.documentId, 320, 1, documentData.documentName);
    let img = new Image();

    img.src = imgUrl;
    img.onload = () => this.setState({ ratio: (img.width / img.height) });
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
      return new Promise((resolve, reject) => {
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


  //  문서 정보 state의 isPublish 업데이트
  setIsPublish = () => {
    return new Promise((resolve, reject) => {
      let _documentData = this.state.documentData;
      _documentData.isPublic = true;
      this.setState({ _documentData: _documentData }, () => {
        resolve();
      });
    });
  };


  //  문서 정보 state의 isRegistry 업데이트
  setIsRegistry = () => {
    return new Promise((resolve, reject) => {
      let _documentData = this.state.documentData;
      _documentData.isRegistry = true;
      this.setState({ _documentData: _documentData }, () => {
        resolve();
      });
    });
  };


  // publish completed modal 종료 관리
  handleCompleteModalOpen = () => this.setState({ completeModalOpen: true });


  // publish completed modal 종료 관리
  handleCompleteModalClose = () => this.setState({ completeModalOpen: false });


  // 퍼블리시 완료 후 관리
  handleAfterPublish = () => this.setIsPublish()
    .then(() => this.handleCompleteModalOpen())
    .then(() => this.triggerRegisterBtn());


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


  // 설정창 표시
  showSetting = () => document.getElementById("viewer-option-table-" + this.props.idx).classList.remove("d-none");


  // 클릭 이벤트 리스너 종료
  handleResizeEnd = (e) => window.removeEventListener("click", () => {
  });


  // 문서 상태관리
  handleState = () => {
    const { setAlertCode } = this.props;
    const { documentData } = this.state;

    if (documentData.accountId !== common_view.getMySub() || !documentData.state || documentData.state === "CONVERT_COMPLETE") return false;

    this.setInterval = setInterval(() => {
      MainRepository.Document.getDocument(documentData.seoTitle).then(res => {
        if (res && res.document.state === "CONVERT_COMPLETE") {
          clearInterval(this.setInterval);
          this.setDocumentState(res.document.state);
          setAlertCode(2075, { title: documentData.title });
        }
      });
    }, 5000);
  };


  componentWillMount(): void {
    this.init();
  }


  componentWillUnmount() {
    this.handleResizeEnd();
  }


  render() {
    const { getCreatorDailyRewardPool, totalViewCountInfo, getIsMobile, idx } = this.props;
    const { ratio, documentData, completeModalOpen } = this.state;

    if (!documentData.seoTitle) return false;

    let reward = Common.toEther(common_view.getAuthorNDaysReward(documentData, getCreatorDailyRewardPool, totalViewCountInfo, 7)),
      vote = Common.toEther(documentData.latestVoteAmount) || 0,
      view = documentData.latestPageview || 0,
      identification = documentData.author ? (documentData.author.username && documentData.author.username.length > 0 ? documentData.author.username : documentData.author.email) : documentData.accountId;

    return (

      <div className="row u_center_inner">
        <div className="pl-0 col-12 col-sm-3 col-lg-2 col-thumb">
          <Link to={"/" + identification + "/" + documentData.seoTitle}
                className={(documentData.state && documentData.state !== "CONVERT_COMPLETE" ? " not-convert-wrapper" : "")}>
            <div className="tab-thumbnail" onClick={() => common_view.scrollTop()}>
              {documentData.state && documentData.state !== "CONVERT_COMPLETE" ?
                <Tooltip title="Converting document..." placement="bottom">
                  <div className="not-convert-container">
                    <div className="not-convert"><FadingCircle size={40} color={"#3d5afe"}/></div>
                  </div>
                </Tooltip>
                :
                <img src={Common.getThumbnail(documentData.documentId, "thumb", 1, documentData.documentName)}
                     alt={documentData.title ? documentData.title : documentData.documentName}
                     className={(ratio >= 1.8 ? "main-category-card-img-landscape" : "main-category-card-img") + (documentData.state && documentData.state !== "CONVERT_COMPLETE" ? " not-convert-background" : "")}/>
              }
            </div>
          </Link>
        </div>


        <div className="col-12 col-sm-9 col-lg-10 p-0">
          {documentData.accountId === common_view.getMySub() &&
          <div className="view-option-btn top-0 right-0" id={"viewer-option-btn-" + idx}>
            <i className="material-icons" id={"view-option-icon-" + idx} onClick={e => this.addInlineBlock(e).then(this.showSetting())}>more_vert</i>
            <div className="option-table d-none" id={"viewer-option-table-" + idx}>
              {documentData.state === "CONVERT_COMPLETE" &&
              <CopyModalContainer documentData={documentData} type="onlyIcon"/>}
              {documentData.state === "CONVERT_COMPLETE" && documentData.isDownload &&
              <div className="option-table-btn" onClick={() => this.handleDownloadContent()}>Download</div>}
              {((Common.dateAgo(documentData.created) > 0 && documentData.state && documentData.state !== "CONVERT_COMPLETE") || documentData.isRegistry === false) &&
              <DeleteDocumentModalContainer documentData={documentData} type="onlyIcon"/>}
            </div>
          </div>
          }

          <Link to={"/" + identification + "/" + documentData.seoTitle}
                className={(documentData.state && documentData.state !== "CONVERT_COMPLETE" ? " not-convert-wrapper" : "")}>
            <div className="info_title mb-1"
                 onClick={() => common_view.scrollTop()}>
              {documentData.title ? documentData.title : documentData.documentName}
            </div>
          </Link>

          <div className="details-info-desc-wrapper">
            <Link to={"/" + identification + "/" + documentData.seoTitle}
                  className={"info_desc " + (documentData.state && documentData.state !== "CONVERT_COMPLETE" ? " not-convert-wrapper" : "")}
                  title="description"
                  onClick={() => common_view.scrollTop()}>
              {documentData.desc &&
              <LinesEllipsis
                text={documentData.desc}
                maxLine={2}
                ellipsis='...'
                trimRight
                basedOn='words'
              />
              }
            </Link>
          </div>

          <div className="tab-item-info-wrapper ">
              <span className={"info-detail-reward mr-3 " + (documentData.isRegistry ? "" : "color-not-registered")}
                    onMouseOver={() => this.showRewardInfo(documentData.seoTitle + "reward")}
                    onMouseOut={() => this.hideRewardInfo(documentData.seoTitle + "reward")}>
                $ {Common.deckToDollar(reward)}
                <img className="reward-arrow"
                     src={require("assets/image/icon/i_arrow_down_" + (documentData.isRegistry ? "blue" : "grey") + ".svg")}
                     alt="arrow button"/>
              </span>
            {reward > 0 && <PayoutCard reward={reward} data={documentData}/>}
            <span className="info-detail-view mr-3">{view}</span>
            <span className="info-detail-vote mr-3">{Common.deckStr(vote)}</span>
            <div className="info-date info-date-profile">{common_view.dateTimeAgo(documentData.created)}</div>

            <div className={(getIsMobile ? "mt-2" : "float-right")}>
              <CreatorClaimContainer {...this.props} document={documentData}/>
            </div>

            {documentData.isPublic === false && documentData.state === "CONVERT_COMPLETE" &&
            <div className={(getIsMobile ? "mt-2" : "float-right")}>
              <PublishModalContainer documentData={documentData} type={"tabItem"}
                                     afterPublish={() => this.handleAfterPublish()}/>
            </div>
            }

            {completeModalOpen && <PublishCompleteModalContainer documentData={documentData}
                                                                 completeModalClose={() => this.handleCompleteModalClose()}/>}

            {documentData.isPublic && (documentData.accountId === common_view.getMySub() && documentData) &&
            <div className={(getIsMobile ? "mt-2" : "float-right")}>
              <RegBlockchainBtnContainer documentData={documentData} type={"tabItem"}
                                         afterRegistered={() => this.handleAfterRegistered()}/>
            </div>
            }
          </div>
        </div>


        <div className="hr-content-list-item d-block d-sm-none"/>


      </div>

    );
  }

}

export default CreatorTabItem;
