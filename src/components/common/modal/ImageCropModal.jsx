import React from "react";
import Cropper from "react-easy-crop";
import { psString } from "../../../config/localization";
import { FadingCircle } from "better-react-spinkit";
import common_view from "../../../common/common_view";
import common from "../../../common/common";
import MainRepository from "../../../redux/MainRepository";
import { APP_PROPERTIES } from "../../../properties/app.properties";


// 파일 읽기
const readFile = file => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
};


class ImageCropModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      closeFlag: false,
      registerLoading: false,
      image: null,
      crop: { x: 0, y: 0 },
      zoom: 1,
      aspect: 1,
      croppedArea: null,
      style: {
        containerStyle: {
          background: "none"
        },
        cropAreaStyle: {
          color: "#ffffff5c"
        }
      }
    };
  }


  // 초기화
  init = async () => {
    common_view.setBodyStyleLock();
    let imageUrl = await readFile(this.props.getModalData.file);

    // 모달 오픈 에니메이션 delay
    this.setTimeout = setTimeout(() => {
      this.setState({ image: imageUrl });
      clearTimeout(this.setTimeout);
    }, 200);
  };


  // crop change check
  onCropChange = crop => {
    this.setState({ crop });
  };


  // crop zoom complete check
  onCropComplete = (croppedArea, croppedAreaPixels) => this.setState({ croppedArea: croppedAreaPixels });


  // crop zoom change check
  onZoomChange = zoom => {
    this.setState({ zoom });
  };


  // 모달 숨기기 클래스 추가
  setCloseFlag = () =>
    new Promise(resolve =>
      this.setState({ closeFlag: true, image: null }, () => resolve()));


  // 모달 취소버튼 클릭 관리
  handleClickClose = () =>
    this.setCloseFlag()
      .then(() => common.delay(200))
      .then(() => common_view.setBodyStyleUnlock())
      .then(() => this.props.setModal(null));


  // 자르기 확인
  handleCropConfirm = () => {
    const { getModalData, getMyInfo, setMyInfo } = this.props;
    const { croppedArea } = this.state;

    if (!croppedArea) return false;

    this.setState({ registerLoading: true });

    // upload url GET
    MainRepository.Account.getProfileImageUploadUrl().then(result => {
      let params = { file: getModalData.file, signedUrl: result.signedUploadUrl };

      // 이미지 서버에 업로드
      MainRepository.Account.profileImageUpload(params, () => {
        let url = APP_PROPERTIES.domain().profile + result.picture;
        let data = {
          "picture": url,
          "croppedArea": croppedArea
        };

        // 유저 정보 업데이트
        MainRepository.Account.updateProfileImage(data).then(() => {
            const myInfo = getMyInfo;
            myInfo.picture = url;
            setMyInfo(myInfo);

            this.handleClickClose();
          }
        );
      });

    }).catch(err => {
      console.error(err);
      this.handleClickClose();
    });
  };


  componentWillMount(): void {
    this.init();
  }


  render() {
    const { registerLoading, closeFlag, image, crop, zoom, aspect, style } = this.state;

    return (
      <div className='custom-modal-image-crop'>
        <div className='custom-modal-container'>
          <div className="custom-modal-wrapper"/>
          <div className={"custom-modal " + (closeFlag ? "custom-hide" : "")}>


            <div className="custom-modal-title">
              <i className="material-icons modal-close-btn"
                 onClick={() => this.handleClickClose()}>close</i>
              <h3>{psString("image-crop-modal-subject")}</h3>
            </div>


            <div className="custom-modal-content">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                style={style}
                cropShape="round"
                showGrid={false}
                onCropChange={this.onCropChange}
                onCropComplete={this.onCropComplete}
                onZoomChange={this.onZoomChange}
              />
            </div>


            <div className="custom-modal-footer">
              <div onClick={() => this.handleClickClose()} className="cancel-btn">
                {psString("common-modal-cancel")}</div>
              <div onClick={() => this.handleCropConfirm()}
                   className={"ok-btn " + (registerLoading ? "btn-disabled" : "")}>
                {registerLoading &&
                <div className="loading-btn-wrapper"><FadingCircle color="#3681fe" size={17}/></div>}
                {psString("common-modal-confirm")}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ImageCropModal;
