import React from "react";
import MainRepository from "../../../redux/MainRepository";
import { APP_PROPERTIES } from "../../../properties/app.properties";

/*로그인 유저 아바타
picture, croppedArea, size 지정하여 사용*/


class MyAvatar extends React.Component {

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

    let xLocation = 0;
    let yLocation = 0;

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
    const { picture, tempEmail, onClicked } = this.props;
    const { wrapperStyle, imgStyle, nameStyle } = this.state;

    return (
      <div className='avatar-wrapper' onClick={() => onClicked ? onClicked() : false} style={wrapperStyle}>
        {MainRepository.Account.isAuthenticated() ?
          picture.length > 0 ?
            <img src={picture} id='header-avatar' alt='Link to my profile'
                 style={imgStyle}
                 onError={(e) => {
                   e.target.onerror = null;
                   e.target.src = require("assets/image/icon/i_profile-default.png");
                 }}/> :
            <img src={require("assets/image/icon/i_profile-default.png")} className='avatar'
                 alt='Link to my profile'/> :
          <div id='header-avatar' className='avatar-init-menu'>
            <div className='avatar-name-init-menu' style={nameStyle}>{tempEmail ? tempEmail[0] : "G"}</div>
          </div>}
      </div>
    );
  }
}

export default MyAvatar;
