import React from "react";
import { Link } from "react-router-dom";

import Common from "../../../../util/Common";
import CuratorClaimContainer from "../../../../container/body/profile/curator/CuratorClaimContainer";
import LinesEllipsis from "react-lines-ellipsis";

class CuratorTabItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ratio: null,
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
      this.setState({ratio : (width/height) });
    };
  };

  componentWillMount(): void {
    this.getImgInfo();
  }


  render() {
    const { document, getCreatorDailyRewardPool, totalViewCountInfo, getIsMobile } = this.props;
    const { ratio} = this.state;

    let reward = Common.toEther(Common.getAuthorNDaysReward(document, getCreatorDailyRewardPool, totalViewCountInfo, 7));
    let vote = Common.toEther(document.latestVoteAmount) || 0;
    let view = document.latestPageview || 0;
    let identification = document.author ? (document.author.username && document.author.username.length > 0 ? document.author.username : document.author.email) : document.accountId;

    return (

      <div className="pl-3 pl-sm-0 pr-3 pr-sm-0 row u_center_inner">

        <div className="pl-0 col-3 col-md-4 col-thumb">
          <Link to={"/" + identification + "/" + document.seoTitle}>
            <div className="tab-thumbnail" onClick={Common.scrollTop()}>
              <img src={Common.getThumbnail(document.documentId, (getIsMobile ? 640 : 320), 1, document.documentName)}
                   alt={document.title ? document.title : document.documentName}
                   className={ratio >= 1.8 ? "main-category-card-img-landscape" : "main-category-card-img"}/>
            </div>
          </Link>
        </div>


        <div className="col-9 col-md-9 col-details_info">
          <div className="details_info details_info-padding">
            <Link to={"/" + identification + "/" + document.seoTitle}>
              <div className="info_title mb-2" onClick={() => Common.scrollTop()}>  {document.title ? document.title : document.documentName} </div>
            </Link>

            <Link to={"/" + identification + "/" + document.seoTitle} className="info_desc" title="description" onClick={() => Common.scrollTop()}>
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


            <div className="tab-item-info-wrapper">
              <span className="info-detail-reward mr-2"
                    onMouseOver={() => this.showRewardInfo(document.seoTitle + "rewardVote")}
                    onMouseOut={() => this.hideRewardInfo(document.seoTitle + "rewardVote")}>
                ${Common.deckToDollar(reward)}
                <img className="reward-arrow" src={require("assets/image/icon/i_arrow_down_blue.svg")} alt="arrow button"/>
              </span>

              {reward > 0 &&
              <div className="info-detail-reward-info" id={document.seoTitle + "rewardVote"}>
                Creator payout <span className="font-weight-bold">{(!reward ? 0 : reward)} DECK</span> in 7 days
              </div>
              }


              <span className="info-detail-view mr-3">{view}</span>
              <span className="info-detail-vote mr-4">{Common.deckStr(vote)}</span>


              <div className="info-date">
                {Common.dateTimeAgo(document.created)}
              </div>

              <div className={(getIsMobile ? "mt-2" : "float-right")}>
                <CuratorClaimContainer {...this.props} document={document}/>
              </div>


            </div>
          </div>


        </div>

        <div className="hr-content-list-item d-block d-sm-none"/>


      </div>

    );
  }

}

export default CuratorTabItem;
