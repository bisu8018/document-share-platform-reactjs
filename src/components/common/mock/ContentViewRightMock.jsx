import React from "react";
import FeaturedListItemMock from "./FeaturedListItemMock";

class ContentViewRightMock extends React.PureComponent {

  render() {
      return (
        <aside className="u__right col-md-12 col-lg-4 ">
          <div className="see-also-main-title-mock"/>
          <div className="hr mt-2"/>
            <FeaturedListItemMock/>
            <FeaturedListItemMock order={2}/>
            <FeaturedListItemMock order={3}/>
        </aside>
      );
  }
}

export default ContentViewRightMock;
