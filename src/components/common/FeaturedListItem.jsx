import React from "react";
import { Link } from "react-router-dom";
import Common from "../../common/common";
import common_view from "../../common/common_view";


class FeaturedList extends React.Component {
  componentWillMount(): void {
    this.getImgInfo();
  }


  render() {
    const { resultItem } = this.props;
    let identification = resultItem.author ? (resultItem.author.username && resultItem.author.username.length > 0 ? resultItem.author.username : resultItem.author.email) : resultItem.accountId;

    return (
      <div className="see-also-container">

        <Link to={"/@" + identification + "/" + resultItem.seoTitle} rel="nofollow">
          <div className="see-also-thumbnail" onClick={common_view.scrollTop()}>i
            <img src={Common.getThumbnail(resultItem.documentId, 320, 1, resultItem.documentName)}
                 className="main-category-card-img"
                 alt={resultItem.documentName ? resultItem.documentName : resultItem.documentId}/>
          </div>
          <div className="see-also-title"> {resultItem.title} </div>
        </Link>

        <div className="see-also-content">
          <Link to={"/@" + identification} rel="nofollow" className="info_name see-also-author" onClick={common_view.scrollTop()}>
            {identification}
          </Link>
        </div>

      </div>
    );
  }
}

export default FeaturedList;
