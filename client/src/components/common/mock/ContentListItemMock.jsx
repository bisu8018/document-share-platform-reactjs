import React from "react";

class ContentListItemMock extends React.PureComponent {

  render() {

    return (
      <div className={"row u_center_inner-mock main-category-mock-" + this.props.order}>
        <div className="col-thumb-list">
            <div className="thumb-image-mock"/>
        </div>

        <div className="col-details_info details_info">
          <div className="mb-1  detail-title-mock"/>
          <div>
            <div className="img-thumbnail-mock"/>
            <div className="main-category-card-name-mock"/>
            <div className="info_date float-right d-inline-block"/>
          </div>

          <div className="details-info-desc-wrapper-mock"/>

          <div className="mt-1">
            <div className="main-category-card-reward-mock mr-2"/>
            <div className="main-category-card-vote-mock mr-2"/>
            <div className="main-category-card-view-mock "/>
          </div>

        </div>
      </div>
    );
  }
}

export default ContentListItemMock;
