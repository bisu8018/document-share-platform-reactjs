import React from "react";
import FeaturedListItemMock from "./FeaturedListItemMock";

class ContentViewSeeAlsoMock extends React.PureComponent {

  render() {
      return (
        <aside className="u__right">
          <div className="see-also-main-title-mock"/>
            <FeaturedListItemMock/>
            <FeaturedListItemMock order={2}/>
            <FeaturedListItemMock order={3}/>
        </aside>
      );
  }
}

export default ContentViewSeeAlsoMock;
