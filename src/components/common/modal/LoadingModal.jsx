import React from "react";
import { DoubleBounce } from "better-react-spinkit";

class LoadingModal extends React.PureComponent{


  componentWillMount(): void {
  }


  render(){

    return (
      <div className="loading-wrapper">
        <img src={require("assets/image/logo-cut.png")} alt="POLARIS SHARE"/>
        <DoubleBounce name="ball-pulse-sync" color="#efefef"/>
      </div>
    );
  }
}

export default LoadingModal;
