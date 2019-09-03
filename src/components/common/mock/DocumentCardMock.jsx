import React from "react";


class DocumentCardMock extends React.PureComponent {


  render() {

    return (
      <div className={"main-category-card-mock mb-3 mr-4 main-category-mock-" + this.props.order}>

        <div className="main-category-card-img-wrapper-mock"/>
        <div className="main-category-card-content-mock">
          <div className="main-category-card-title-mock mb-2"/>
          <div className="main-category-card-title-mock"/>
          <div className="d-flex position-relative">
            <div className="img-thumbnail-mock"/>
            <div className="main-category-card-name-mock"/>
            <div className="main-category-card-date-mock"/>
          </div>
          <div className="main-category-card-count">
            <div className="main-category-card-reward-mock float-left"/>
            <div className="main-category-card-vote-mock float-right"/>
            <div className="main-category-card-view-mock float-right"/>
          </div>
        </div>
      </div>
    );
  }
}

export default DocumentCardMock;
