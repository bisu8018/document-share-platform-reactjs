import React from "react";
import { DoubleBounce } from "better-react-spinkit";
import { APP_PROPERTIES } from "../../../properties/app.properties";

class LoadingModal extends React.PureComponent{


  componentWillMount(): void {
  }


  render(){

    return (
      <div className="loading-wrapper">
        <img src={APP_PROPERTIES.domain().static + "/image/logo-cut.png"} alt="POLARIS SHARE"/>
        <DoubleBounce name="ball-pulse-sync" color="#ddeaff" size={110}/>
      </div>
    );
  }
}

export default LoadingModal;
