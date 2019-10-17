import React from "react";


class DocumentCardMock extends React.PureComponent {


  render() {

    return (
      <div className={"main-category-card-mock mb-sm-3 mr-sm-3 main-category-mock-" + this.props.order}>

        <div className="main-category-card-img-wrapper-mock"/>
        <div className="main-category-card-content-mock">
          <div className="main-category-card-title-mock mb-2"/>
          <div className="d-flex position-relative mb-3">
            <div className="img-thumbnail-mock"/>
            <div className="main-category-card-name-mock"/>
            <div className="main-category-card-date-mock"/>
          </div>
          <div className="main-category-card-count">
            <div className="main-category-card-reward-mock mr-3"/>
            <div className="main-category-card-vote-mock mr-3"/>
            <div className="main-category-card-view-mock"/>
          </div>
        </div>
      </div>
    );
  }
}

export default DocumentCardMock;
