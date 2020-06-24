import React from "react";
import DocumentCardMock from "./DocumentCardMock";


class ContentMainListMock extends React.PureComponent {


  render() {

    return (
      <div className="main-category">
        <div className="p-3 pl-sm-0 pb-sm-3">
          <div className="main-category-name-mock"/>
        </div>

        <div className="row main-category-card-wrapper">
          <DocumentCardMock/>
          <DocumentCardMock order={2}/>
          <DocumentCardMock order={3}/>
          <DocumentCardMock order={4}/>
        </div>
      </div>
    );
  }
}

export default ContentMainListMock;
