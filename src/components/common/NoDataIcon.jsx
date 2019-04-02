import React from "react";

class NoDataIcon extends React.PureComponent {
  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <div className="no-data-icon">
        <i className="material-icons">report</i><br/>
        NO DATA
      </div>
    );
  }
}

export default NoDataIcon;