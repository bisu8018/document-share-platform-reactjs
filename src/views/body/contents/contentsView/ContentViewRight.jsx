import React from "react";
import Spinner from "react-spinkit";
import { Link } from "react-router-dom";

import Common from "../../../../common/Common";

class ContentViewRight extends React.Component {

  render() {
    const { documentData, featuredList } = this.props;
    if (!documentData) {
      return (<div className="spinner"><Spinner name="ball-pulse-sync"/></div>);
    } else {
      return (
        <div className="u__right">
          <h4>See also</h4>
          <hr/>
          {featuredList.map((result, idx) => (
            <div key={idx}>
              <div className="see-also-container">

                <Link to={"/content/view/" + result.documentId}>
                  <div className="see-also-thumbnail">
                    <img src={Common.getThumbnail(result.documentId, 1)}
                         alt={result.documentName ? result.documentName : result.documentId}/>
                  </div>
                  <div className="see-also-title"> {result.title} </div>
                </Link>

                <div className="see-also-content">
                  <Link to={"/author/" + result.accountId} className="info_name see-also-author" >
                    {result.nickname ? result.nickname : result.accountId}
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      );
    }


  }
}

export default ContentViewRight;
