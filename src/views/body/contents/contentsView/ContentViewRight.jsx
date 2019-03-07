import React from "react";
import Spinner from "react-spinkit";
import { Link } from "react-router-dom";

import * as restapi from "apis/DocApi";

class ContentViewRight extends React.Component {

  render() {
    const { document, featuredList } = this.props;
    if (!document) {
      return (<div className="spinner"><Spinner name="ball-pulse-sync"/></div>);
    }

    return (

      <div className="u__right">

        <h5>See also</h5>

        {featuredList.map((result,idx) => (
          <div key={idx}>
            <hr/>
            <Link to={"/content/view/" + result.documentId}>
              <div className="see-also-container">
                <div className="see-also-thumbnail">
                  <img src={restapi.getThumbnail(result.documentId, 1)}
                       alt={result.documentName ? result.documentName : result.documentId}/>
                </div>
                <div className="see-also-content">
                  <div className="see-also-title"> {result.title} </div>
                  <div className="see-also-author"> {result.nickname} </div>
                </div>
              </div>
            </Link>
          </div>
        ))}


      </div>

    );
  }
}

export default ContentViewRight;
