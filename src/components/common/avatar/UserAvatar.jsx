import React from "react";
import { APP_PROPERTIES } from "../../../properties/app.properties";
import common_view from "../../../common/common_view";

/*일반 유저 아바타
picture, croppedArea, size 지정하여 사용*/


class UserAvatar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      style: false
    };
  }


  //초기화
  init = () => {
    const { croppedArea, size } = this.props;

    if (APP_PROPERTIES.ssr) return;

    let xLocation = 1;
    let yLocation = 1;

    if (croppedArea) {
      xLocation = Math.floor(croppedArea.x / ((this.getImgInfo() ? croppedArea.height : croppedArea.width) / size));
      yLocation = Math.floor(croppedArea.y / ((this.getImgInfo() ? croppedArea.height : croppedArea.width) / size));
    }


    this.setState({
      wrapperStyle: {
        width: (size || 30) + "px",
        height: (size || 30) + "px"
      },
      imgStyle: {
        width: this.getImgInfo() ? "auto" : "inherit",
        height: !this.getImgInfo() ? "auto" : "inherit",
        left: "-" + xLocation + "px",
        top: "-" + yLocation + "px"
      },
      nameStyle: {
        fontSize: size > 33 ? "50px" : "16px"
      }
    });
  };


  // 이미지 정보 GET
  getImgInfo = () => {
    const { picture } = this.props;
    let img = new Image();

    img.src = picture;
    return img.onload = () => img.height > img.width;
  };


  componentWillMount(): void {
    this.init();
  }


  render() {
    const { picture } = this.props;
    const { wrapperStyle, imgStyle } = this.state;

    return (
      <div className='avatar-wrapper' style={wrapperStyle}>
        <img src={picture} alt="profile" style={imgStyle} onClick={() => common_view.scrollTop()}
             onError={(e) => {
               e.target.onerror = null;
               e.target.src = require("assets/image/icon/i_profile-default.png");
             }}/>
      </div>
    );
  }
}

export default UserAvatar;
