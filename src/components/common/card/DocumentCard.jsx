import React from "react";
import Common from "../../../config/common";
import { Link } from "react-router-dom";
import LinesEllipsis from "react-lines-ellipsis";
import { psString } from "../../../config/localization";

class DocumentCard extends React.Component {
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


  // 이미지 정보 GET
  getImgInfo = () => {
    const { documentData } = this.props;
    let img = new Image();

    img.src = Common.getThumbnail(documentData.documentId, 640, 1, documentData.documentName);
    img.onload = () => {
      let height = img.height;
      let width = img.width;
      this.setState({ ratio: (width / height) });
    };
  };

  componentWillMount(): void {
    this.getImgInfo();
  }

  render() {
    const { idx, path, documentData, getCreatorDailyRewardPool, totalViewCountInfo, countCards } = this.props;
    const { ratio } = this.state;

    let author = documentData.author,
      identification = author ? (author.username && author.username.length > 0 ? author.username : author.email) : documentData.accountId,
      imgUrl = Common.getThumbnail(documentData.documentId, 640, 1, documentData.documentName),
      profileUrl = author ? author.picture : null,
      vote = Common.toEther(documentData.latestVoteAmount) || 0,
      reward = Common.toEther(Common.getAuthorNDaysReward(documentData, getCreatorDailyRewardPool, totalViewCountInfo, 7)),
      view = documentData.latestPageview || 0;

    return (
      <div>
        <div
          className={"main-category-card mb-3 " + (idx < (countCards - 1) && " mr-0 mr-sm-3 ") + (idx === (countCards - 1) && " mr-0 mr-sm-3 mr-lg-0")}>
          <Link to={"/" + identification + "/" + documentData.seoTitle}>
            <div className="main-category-card-img-wrapper" onClick={() => Common.scrollTop()}>
              <img src={imgUrl} alt={documentData.title}
                   className={ratio >= 1.8 ? "main-category-card-img-landscape" : "main-category-card-img"}/>
            </div>
          </Link>
          <div className="main-category-card-content">
            <div className="main-category-card-title">
              <Link to={"/" + identification + "/" + documentData.seoTitle} onClick={() => Common.scrollTop()}
                    title={documentData.title}>
                <LinesEllipsis
                  text={documentData.title ? documentData.title : documentData.documentName}
                  maxLine={2}
                  ellipsis='...'
                  trimRight
                  basedOn='words'
                />
              </Link>
            </div>
            <Link to={"/" + identification} className="main-category-card-profile mt-1 mb-1 pt-1 pb-2 w-full">
              {profileUrl ?
                <img src={profileUrl} alt="profile" onClick={() => Common.scrollTop()}/> :
                <i className="material-icons img-thumbnail" onClick={() => Common.scrollTop()}>face</i>
              }
              <span className="main-category-card-name">{identification}</span>
              <span className="main-category-card-date">
                {Common.dateTimeAgo(documentData.created)}
              </span>
            </Link>
            <div className="main-category-card-count">
              <span className={"main-category-card-reward " + (documentData.isRegistry ? "" : "color-not-registered")}
                    onMouseOver={() => this.showRewardInfo(path + idx)}
                    onMouseOut={() => this.hideRewardInfo(path + idx)}>
                ${Common.deckToDollar(reward)}
                <img className="reward-arrow"
                     src={require("assets/image/icon/i_arrow_down_" + (documentData.isRegistry ? "blue" : "grey") + ".svg")}
                     alt="arrow button"/>
              </span>
              <span className="main-category-card-vote float-right">{Common.deckStr(vote)}</span>
              <span className="main-category-card-view float-right">{view}</span>
            </div>
          </div>

          {reward > 0 && (
            documentData.isRegistry ?
              <div className={"main-category-card-reward-info"} id={path + idx}>
                {psString("profile-payout-txt-1")}
                <span
                  className="font-weight-bold ml-1">{(!reward ? 0 : reward)} DECK</span> {psString("profile-payout-txt-2")}
              </div>
              :
              <div className={"main-category-card-reward-info reward-info-not-registered"} id={path + idx}>
                <div className="reward-info-not-registered-syntax">{psString("payout-registered")}</div>
                {psString("payout-text-2")}
                <span className="font-weight-bold ml-1">{(!reward ? 0 : reward)} DECK</span>
              </div>
          )

          }
        </div>

      </div>


    );
  }
}

export default DocumentCard;
