import React from "react";
import DocumentCardMock from "./DocumentCardMock";


class ContentMainListMock extends React.PureComponent {


  render() {

    return (
      <div className="main-category">
        <div className="mb-3">
          <div className="main-category-name-mock"/>
          <div className="main-category-see-all-mock"/>
        </div>

        <div className="row main-category-card-wrapper">
          <DocumentCardMock/>
          <DocumentCardMock order={2}/>
          <DocumentCardMock order={3}/>
        </div>
      </div>
    );
  }
}

export default ContentMainListMock;
