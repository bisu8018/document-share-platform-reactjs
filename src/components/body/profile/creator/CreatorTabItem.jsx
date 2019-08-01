import React from "react";
import { Link } from "react-router-dom";

import Common from "../../../../config/common";
import CreatorClaimContainer from "../../../../container/body/profile/creator/CreatorClaimContainer";
import { FadingCircle } from "better-react-spinkit";
import Tooltip from "@material-ui/core/Tooltip";
import LinesEllipsis from "react-lines-ellipsis";
import PayoutCard from "../../../common/card/PayoutCard";
import CopyModalContainer from "../../../../container/common/modal/CopyModalContainer";
import DeleteDocumentModalContainer from "../../../../container/common/modal/DeleteDocumentModalContainer";
import PublishModalContainer from "../../../../container/common/modal/PublishModalContainer";
import MainRepository from "../../../../redux/MainRepository";

class CreatorTabItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ratio: null
    };
  }


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
        const viewerOptionBtn = document.getElementById("viewer-option-btn-" + idx);
        const viewerOptionTable = document.getElementById("viewer-option-table-" + idx);
        if (viewerOptionBtn && !viewerOptionBtn.contains(targetElement)) viewerOptionTable.classList.add("d-none");
      }
    );
  };


  // 이미지 정보 GET
  getImgInfo = () => {
    const { document } = this.props;
    let imgUrl = Common.getThumbnail(document.documentId, 320, 1, document.documentName);
    let img = new Image();

    img.src = imgUrl;
    img.onload = () => {
      let height = img.height;
      let width = img.width;
      this.setState({ ratio: (width / height) });
    };
  };


  //문서 다운로드
  getContentDownload = (accountId, documentId, documentName) => {

    MainRepository.Document.getDocumentDownloadUrl({ documentId: documentId })
      .then(result => {
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


  //문서 다운로드 전 데이터 SET
  handleDownloadContent = () => {
    const { getMyInfo, document, setAlertCode } = this.props;

    if (!document) return setAlertCode(2091);
    if (!MainRepository.Account.isAuthenticated() && !getMyInfo.email) return setAlertCode(2003);

    const accountId = document.accountId,
      documentId = document.documentId,
      documentName = document.documentName;

    this.getContentDownload(accountId, documentId, documentName);
  };


  // 설정창 관리
  handleSetting = () => {
    document.getElementById("viewer-option-table-" + this.props.idx).classList.remove("d-none");
  };


  // 클릭 이벤트 리스너 종료
  handleResizeEnd = (e) => {
    window.removeEventListener("click", () => {
    });
  };


  componentWillMount(): void {
    this.getImgInfo();
    this.clickEventListener();
  }


  componentWillUnmount() {
    this.handleResizeEnd();
  }


  render() {
    const { document, getCreatorDailyRewardPool, totalViewCountInfo, getIsMobile, idx } = this.props;
    const { ratio } = this.state;

    let reward = Common.toEther(Common.getAuthorNDaysReward(document, getCreatorDailyRewardPool, totalViewCountInfo, 7)),
      vote = Common.toEther(document.latestVoteAmount) || 0,
      view = document.latestPageview || 0,
      identification = document.author ? (document.author.username && document.author.username.length > 0 ? document.author.username : document.author.email) : document.accountId;

    return (

      <div className="row u_center_inner">
        <div className="pl-0 col-12 col-sm-3 col-lg-2 col-thumb">
          <Link to={"/" + identification + "/" + document.seoTitle}
                className={(document.state && document.state !== "CONVERT_COMPLETE" ? " not-convert-wrapper" : "")}>
            <div className="tab-thumbnail" onClick={() => Common.scrollTop()}>
              {document.state && document.state !== "CONVERT_COMPLETE" ?
                <Tooltip title="Converting document..." placement="bottom">
                  <div className="not-convert-container">
                    <div className="not-convert"><FadingCircle size={40} color={"#3d5afe"}/></div>
                  </div>
                </Tooltip>
                :
                <img src={Common.getThumbnail(document.documentId, "thumb", 1, document.documentName)}
                     alt={document.title ? document.title : document.documentName}
                     className={(ratio >= 1.8 ? "main-category-card-img-landscape" : "main-category-card-img") + (document.state && document.state !== "CONVERT_COMPLETE" ? " not-convert-background" : "")}/>
              }
            </div>
          </Link>
        </div>


        <div className="col-12 col-sm-9 col-lg-10 p-0">
          {document.accountId === Common.getMySub() &&
          <div className="view-option-btn top-0 right-0" id={"viewer-option-btn-" + idx}>
            <i className="material-icons" onClick={() => this.handleSetting()}>more_vert</i>
            <div className="option-table d-none" id={"viewer-option-table-" + idx}>
              {document.state === "CONVERT_COMPLETE" && <CopyModalContainer documentData={document} type="onlyIcon"/>}
              {document.state === "CONVERT_COMPLETE" && document.isDownload &&
              <div className="option-table-btn" onClick={() => this.handleDownloadContent()}>Download</div>}
              {((Common.dateAgo(document.created) > 0 && document.state && document.state !== "CONVERT_COMPLETE") || document.isPublic === false) &&
              <DeleteDocumentModalContainer documentData={document} type="onlyIcon"/>}
            </div>
          </div>
          }

          <Link to={"/" + identification + "/" + document.seoTitle}
                className={(document.state && document.state !== "CONVERT_COMPLETE" ? " not-convert-wrapper" : "")}>
            <div className="info_title mb-1"
                 onClick={() => Common.scrollTop()}>
              {document.title ? document.title : document.documentName}
            </div>
          </Link>

          <div className="details-info-desc-wrapper">
            <Link to={"/" + identification + "/" + document.seoTitle}
                  className={"info_desc " + (document.state && document.state !== "CONVERT_COMPLETE" ? " not-convert-wrapper" : "")}
                  title="description"
                  onClick={() => Common.scrollTop()}>
              {document.desc &&
              <LinesEllipsis
                text={document.desc}
                maxLine={2}
                ellipsis='...'
                trimRight
                basedOn='words'
              />
              }
            </Link>
          </div>

          <div className="tab-item-info-wrapper ">
              <span className={"info-detail-reward mr-3 " + (document.isRegistry ? "" : "color-not-registered")}
                    onMouseOver={() => this.showRewardInfo(document.seoTitle + "reward")}
                    onMouseOut={() => this.hideRewardInfo(document.seoTitle + "reward")}>
                $ {Common.deckToDollar(reward)}
                <img className="reward-arrow"
                     src={require("assets/image/icon/i_arrow_down_" + (document.isRegistry ? "blue" : "grey") + ".svg")}
                     alt="arrow button"/>
              </span>
            {reward > 0 && <PayoutCard reward={reward} data={document}/>}
            <span className="info-detail-view mr-3">{view}</span>
            <span className="info-detail-vote mr-3">{Common.deckStr(vote)}</span>
            <div className="info-date info-date-profile">{Common.dateTimeAgo(document.created)}</div>

            <div className={(getIsMobile ? "mt-2" : "float-right")}>
              <CreatorClaimContainer {...this.props} document={document}/>
            </div>

            {document.isPublic === false && document.state === "CONVERT_COMPLETE" &&
            <div className={(getIsMobile ? "mt-2" : "float-right")}>
              <PublishModalContainer documentData={document} type={"tabItem"}/>
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
