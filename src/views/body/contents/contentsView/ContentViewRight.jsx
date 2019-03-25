import React from "react";
import Spinner from "react-spinkit";
import FeaturedList from "../../../../components/common/FeaturedListItem";

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
            <FeaturedList resultItem={result} key={idx}/>
          ))}
        </div>
      );
    }


  }
}

export default ContentViewRight;
