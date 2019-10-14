import React from "react";
import FeaturedListItemMock from "./FeaturedListItemMock";

class ContentViewSeeAlsoMock extends React.PureComponent {

  render() {
      return (
        <aside className="u__right col-12 mb-5">
          <div className="see-also-main-title-mock"/>
          <div className="hr mt-2"/>
            <FeaturedListItemMock/>
            <FeaturedListItemMock order={2}/>
            <FeaturedListItemMock order={3}/>
        </aside>
      );
  }
}

export default ContentViewSeeAlsoMock;
