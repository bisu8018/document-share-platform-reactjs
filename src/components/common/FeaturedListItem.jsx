import React from "react";
import { Link } from "react-router-dom";
import Common from "../../common/Common";

class FeaturedList extends React.Component {
  render() {
    const { resultItem} = this.props;
    return (
        <div className="see-also-container">

          <Link to={ "/doc/" + resultItem.seoTitle}>
            <div className="see-also-thumbnail">
              <img src={ Common.getThumbnail(resultItem.documentId, 1) }
                   alt={ resultItem.documentName ? resultItem.documentName : resultItem.documentId }/>
            </div>
            <div className="see-also-title"> {resultItem.title} </div>
          </Link>

          <div className="see-also-content">
            <Link to={"/author/" + resultItem.accountId} className="info_name see-also-author" >
              {resultItem.nickname ? resultItem.nickname : resultItem.accountId}
            </Link>
          </div>

        </div>
    )
  }
}

export default FeaturedList