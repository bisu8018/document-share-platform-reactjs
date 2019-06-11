import React from "react";
import { Link } from "react-router-dom";
import LinesEllipsis from "react-lines-ellipsis";
import Common from "../../../util/Common";

class ContentListItem extends React.Component {
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
    const { result } = this.props;
    let imgUrl = Common.getThumbnail(result.documentId, 320, 1, result.documentName);
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
    const { result, getCreatorDailyRewardPool, totalViewCountInfo, getIsMobile } = this.props;
    const { ratio} = this.state;

    let vote = Common.toEther(result.latestVoteAmount) || 0;
    let reward = Common.toEther(Common.getAuthorNDaysReward(result, getCreatorDailyRewardPool, totalViewCountInfo, 7));
    let view = result.latestPageview || 0;
    let imageUrl = Common.getThumbnail(result.documentId, (getIsMobile ? 640 : 320), 1, result.documentName);
    let profileUrl = result.author ? result.author.picture : null;
    let identification = result.author ? (result.author.username && result.author.username.length > 0 ? result.author.username : result.author.email) : result.accountId;

    return (
      <div className="row u_center_inner" key={result.seoTitle}>
        <div className="col-thumb-list">
          <Link to={"/" + identification + "/" + result.seoTitle}>
            <div className="thumb_image" onClick={() => Common.scrollTop()}>
              <img src={imageUrl} alt={result.title} className={ratio >= 1.8 ? "main-category-card-img-landscape" : "main-category-card-img"}/>
            </div>
          </Link>
        </div>

        <div className="col-details_info details_info">
          <div className="mb-3 mb-sm-2 detail-title">
            <Link to={"/" + identification + "/" + result.seoTitle} onClick={() => Common.scrollTop()}
                  title={result.title}> {result.title ? result.title : result.documentName}</Link>
          </div>
          <div className="mb-2">
            <Link to={"/" + identification} className="info_name"
                  title={identification}>
              {profileUrl ?
                <img src={profileUrl} alt="profile" onClick={() => Common.scrollTop()}/> : <i className="material-icons img-thumbnail" onClick={() => this.menuClick()}>face</i>
              }
              {identification}
            </Link>
            <div className="info_date float-right d-inline-block">
              {Common.dateTimeAgo(result.created)}
            </div>
          </div>


          <Link to={"/" + identification + "/" + result.seoTitle} className="info_desc" title={result.desc} onClick={() => Common.scrollTop()}>
            {result.desc &&
            <LinesEllipsis
              text={result.desc}
              maxLine={2}
              ellipsis='...'
              trimRight
              basedOn='words'
            />
            }
          </Link>


          <div className="info_detail mt-2">
            <span className="info-detail-reward mr-3"
                  onMouseOver={() => this.showRewardInfo(result.seoTitle + "reward")}
                  onMouseOut={() => this.hideRewardInfo(result.seoTitle + "reward")}>
              ${Common.deckToDollar(reward)}
              <img className="reward-arrow" src={require("assets/image/icon/i_arrow_down_blue.svg")} alt="arrow button"/>
            </span>
            <span className="info-detail-view mr-3">{view}</span>
            <span className="info-detail-vote mr-3">{Common.deckStr(vote)}</span>
          </div>

          {reward > 0 &&
          <div className="info-detail-reward-info" id={result.seoTitle + "reward"}>
            Creator payout <span className="font-weight-bold">{(!reward ? 0 : reward)} DECK</span> in 7 days
          </div>
          }

        </div>
        <div className="hr-content-list-item d-block d-sm-none"/>
      </div>
    );
  }
}

export default ContentListItem;
