import React from "react";
import { ThreeBounce } from 'better-react-spinkit'
import FeaturedList from "../../../common/FeaturedListItem";

class ContentViewRight extends React.Component {

  render() {
    const { documentData, featuredList } = this.props;
    if (!documentData) {
      return (<div className="spinner"><ThreeBounce name="ball-pulse-sync"/></div>);
    } else {
      return (
        <div className="u__right">
          <div>See also</div>
          <div className="hr mt-2"/>
          {featuredList.length > 0 && featuredList.map((result, idx) => (
            <FeaturedList resultItem={result} key={idx}/>
          ))}
        </div>
      );
    }


  }
}

export default ContentViewRight;
