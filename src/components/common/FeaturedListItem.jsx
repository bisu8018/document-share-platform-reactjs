import React from "react";
import { Link } from "react-router-dom";
import Common from "../../common/Common";

class FeaturedList extends React.Component {
  render() {
    const { resultItem} = this.props;
    let personality = resultItem.author ? (resultItem.author.username && resultItem.author.username.length > 0 ? resultItem.author.username : resultItem.author.email) : resultItem.accountId;

    return (
        <div className="see-also-container">

          <Link to={ "/doc/" + resultItem.seoTitle}>
            <div className="see-also-thumbnail">
              <img src={ Common.getThumbnail(resultItem.documentId,320,  1, resultItem.documentName) }
                   alt={ resultItem.documentName ? resultItem.documentName : resultItem.documentId }/>
            </div>
            <div className="see-also-title"> {resultItem.title} </div>
          </Link>

          <div className="see-also-content">
            <Link to={"/author/" + personality} className="info_name see-also-author" >
              {personality}
            </Link>
          </div>

        </div>
    )
  }
}

export default FeaturedList