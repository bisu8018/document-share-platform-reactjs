import React from "react";
import { Link } from "react-router-dom";

import Common from "../../../../util/Common";
import CreatorClaimContainer from "../../../../container/body/profile/creator/CreatorClaimContainer";
import { FadingCircle } from "better-react-spinkit";
import Tooltip from "@material-ui/core/Tooltip";
import LinesEllipsis from "react-lines-ellipsis";

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


  //이미지 GET 에러 합수
  onImgError = () => {

  };

  componentWillMount(): void {
    this.getImgInfo();
  }

  render() {
    const { document, getCreatorDailyRewardPool, totalViewCountInfo, getIsMobile } = this.props;
    const { ratio } = this.state;

    let reward = Common.toEther(Common.getAuthorNDaysReward(document, getCreatorDailyRewardPool, totalViewCountInfo, 7));
    let vote = Common.toEther(document.latestVoteAmount) || 0;
    let view = document.latestPageview || 0;
    let identification = document.author ? (document.author.username && document.author.username.length > 0 ? document.author.username : document.author.email) : document.accountId;

    return (

      <div className="pl-3 pl-sm-0 pr-3 pr-sm-0 row u_center_inner">


        <div className="pl-0 col-12 col-sm-3 col-lg-2 col-thumb">
          <Link to={"/" + identification + "/" + document.seoTitle}>
            <div className="tab-thumbnail" onClick={() => Common.scrollTop()}>
              <img src={Common.getThumbnail(document.documentId, "thumb", 1, document.documentName)}
                   onError={(e) => {
                     e.target.src = (Common.getThumbnail(document.documentId, (getIsMobile ? 640 : 320), 1, document.documentName));
                   }}
                   alt={document.title ? document.title : document.documentName}
                   className={(ratio >= 1.8 ? "main-category-card-img-landscape" : "main-category-card-img") + (document.state && document.state === "NOT_CONVERT" ? "not-convert-background" : "")}/>

              {document.state && document.state === "NOT_CONVERT" &&
              <div className="not-convert">
                <Tooltip title="Converting document..." placement="bottom">
                  <FadingCircle size={40} color={"#3d5afe"}/>
                </Tooltip>
              </div>
              }
            </div>
          </Link>
        </div>


        <div className="col-12 col-sm-9 col-lg-10 p-0">
          <div className="details_info-padding">
            <Link to={"/" + identification + "/" + document.seoTitle}>
              <div className="info_title mb-2"
                   onClick={() => Common.scrollTop()}>  {document.title ? document.title : document.documentName} </div>
            </Link>

            <div className="details-info-desc-wrapper">
              <Link to={"/" + identification + "/" + document.seoTitle} className="info_desc" title="description"
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
              <span className="info-detail-reward mr-2"
                    onMouseOver={() => this.showRewardInfo(document.seoTitle + "rewardUpload")}
                    onMouseOut={() => this.hideRewardInfo(document.seoTitle + "rewardUpload")}>
                ${Common.deckToDollar(reward)}
                <img className="reward-arrow" src={require("assets/image/icon/i_arrow_down_blue.svg")}
                     alt="arrow button"/>
              </span>

              {reward > 0 &&
              <div className="info-detail-reward-info" id={document.seoTitle + "rewardUpload"}>
                Creator payout <span className="font-weight-bold">{(!reward ? 0 : reward)} DECK</span> in 7 days
              </div>
              }


              <span className="info-detail-view mr-3">{view}</span>
              <span className="info-detail-vote mr-4">{Common.deckStr(vote)}</span>


              <div className="info-date">
                {Common.dateTimeAgo(document.created)}
              </div>

              <div className={(getIsMobile ? "mt-2" : "float-right")}>
                <CreatorClaimContainer {...this.props} document={document}/>
              </div>

            </div>
          </div>


        </div>

        <div className="hr-content-list-item d-block d-sm-none"/>


      </div>

    );
  }

}

export default CreatorTabItem;
