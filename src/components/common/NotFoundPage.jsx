import React from "react";

class NotFoundPage extends React.PureComponent {
  render(){
    const { errMessage } = this.props;

    return (
      <div className="no-data-icon">
        <i className="material-icons">report</i><br/>
        { errMessage }
      </div>
    );
  }
}

export default NotFoundPage;