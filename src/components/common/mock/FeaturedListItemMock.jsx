import React from "react";

class FeaturedListItemMock extends React.PureComponent {
  render() {
    return (
      <div className={"see-also-container d-flex see-also-wrapper-mock-" + this.props.order}>
        <div className="see-also-thumbnail-mock"/>
        <div className="see-also-container-mock">
          <div className="see-also-title-mock"/>
          <div className="see-also-content-mock"/>
        </div>
      </div>
    );
  }
}

export default FeaturedListItemMock;
