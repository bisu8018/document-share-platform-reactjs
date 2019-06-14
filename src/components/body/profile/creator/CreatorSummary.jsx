import React from "react";
import { APP_PROPERTIES } from "properties/app.properties";
import DollarWithDeck from "../../../common/DollarWithDeck";
import MainRepository from "../../../../redux/MainRepository";
import Common from "../../../../util/Common";
import BalanceOfContainer from "../../../../container/common/BalanceOfContainer";

class CreatorSummary extends React.Component {
  state = {
    balance: -1,
    profileImage: "",
    userName: "",
    userNameEdit: false,
    errMsg: ""
  };


  //유저 네임 유효성 체크
  userNameValidate = (name) => {
    if (!name || name.length < 1) {
      this.setState({ errMsg: "Please input the user name." });
      return false;
    }
    if (!Common.checkUsernameForm(name)) {
      this.setState({ errMsg: "Only allow english and numeric." });
      return false;
    }
    if (name.length < 4 || name.length > 20) {
      this.setState({ errMsg: "Enter 4 to 20 digits with a mix of letters and numbers." });
      return false;
    }
    if (this.state.errMsg !== "") this.setState({ errMsg: "" }, () => {
      return true;
    });

  };


  // 내 정보 GET
  getMyInfo = () => {
    return MainRepository.Account.getMyInfo();
  };


  // 잔액 조회
  getBalance = () => {
    const { getWeb3Apis, userInfo } = this.props;
    const { balance } = this.state;
    let address = userInfo.ethAccount;
    if (!address || balance > 0) return false;

    getWeb3Apis.getBalance(userInfo.ethAccount, res => {
      this.setState({ balance: res });
    });
  };


  // file upload
  handleFileUpload = () => {
    document.getElementById("imgFile").click();
  };


  //file input 등록/변경 시, url get
  handleFileChange = (e) => {
    const file = e[0];

    // upload url GET
    MainRepository.Account.getProfileImageUploadUrl(result => {
      let params = {
        file: file,
        signedUrl: result.signedUploadUrl
      };
      // 이미지 서버에 업로드
      MainRepository.Account.profileImageUpload(params, () => {
        let url = APP_PROPERTIES.domain().profile + result.picture;
        // 유저 정보 업데이트
        MainRepository.Account.updateProfileImage(url, () => {
          this.setState({ profileImage: url });
        });
      }, () => {
        let imgField = document.getElementById("imgFile");
        imgField.value = null;
      });
    });
  };


  //username 수정 시
  handleClickEvent = () => {
    this.setState({ userNameEdit: true }, () => {
      if (this.state.userNameEdit) document.getElementById("userNameEditInput").focus();
    });
  };


  //username 수정 취소 시
  handleCancelEvent = () => {
    const { userInfo } = this.props;
    this.setState({ userName: userInfo.username, userNameEdit: false, errMsg: "" });
  };


  //수정 버튼 핸들
  handleEditBtn = () => {
    let name = document.getElementById("userNameEditInput").value;
    if (this.userNameValidate(name) && this.state.errMsg === "") {
      let userNameValue = document.getElementById("userNameEditInput").value;
      MainRepository.Account.updateUsername(userNameValue, () => {
        this.setState({ userNameEdit: false });
        this.setState({ userName: userNameValue });
      });
    }
  };


  //유져네임 수정 상태 핸들
  handleChangeUsername = (e) => {
    let name = e.target.value;
    this.userNameValidate(name);
    this.setState({ userName: name });
  };


  shouldComponentUpdate = () => {
    this.getBalance();    // 잔액 조회
    return true;
  };


  componentWillMount(): void {
    const { userInfo } = this.props;

    this.setState({ userName: userInfo.username });
    this.setState({ profileImage: userInfo.picture });
  }

  render() {
    const { userInfo, getCreatorDailyRewardPool, getCuratorDailyRewardPool, uploadTotalViewCountInfo, uploadDocumentList, voteDocumentList, voteTotalViewCountInfo, latestRewardVoteList } = this.props;
    const { balance, userNameEdit, userName, profileImage, errMsg } = this.state;

    let author7DayReward = Common.toDeck(Common.getAuthor7DaysTotalReward(uploadDocumentList, getCreatorDailyRewardPool, uploadTotalViewCountInfo));
    let authorTodayReward = Common.toDeck(Common.getAuthorNDaysTotalReward(uploadDocumentList, getCreatorDailyRewardPool, uploadTotalViewCountInfo, 0));
    let curatorEstimatedToday = Common.toDeck(Common.getCuratorNDaysTotalReward(voteDocumentList, getCuratorDailyRewardPool, voteTotalViewCountInfo, 0, latestRewardVoteList));
    let curatorTotalRewards = Common.toDeck(Common.getCurator7DaysTotalReward(voteDocumentList, getCuratorDailyRewardPool, voteTotalViewCountInfo, latestRewardVoteList));

    return (

      <div className="profile_container">
        <div className="row  profile_top">
          <div className="profile-top-wrapper"/>
          <div className="pl-0 col-12 col-sm-2 col-lg-1 ">
            <div className="profile-image" title="Change profile image">
              <img src={profileImage} alt="profile" className="img-fluid"/>
              {this.getMyInfo().email === userInfo.email &&
              <div className="profile-image-edit" onClick={this.handleFileUpload}><i className="material-icons">edit</i>
              </div>
              }
            </div>
            {this.getMyInfo().email === userInfo.email &&
            <input type="file" id="imgFile" accept="image/*" onChange={(e) => this.handleFileChange(e.target.files)}/>
            }
          </div>


          <div className="col-12 col-sm-10 col-lg-11 ">
            <div className="profile_info_name">
              {!userNameEdit &&
              <span className="d-flex">
                <strong>{userName || userInfo.email}</strong>
                {this.getMyInfo().email === userInfo.email &&
                <div className="username-edit-btn ml-2" onClick={() => this.handleClickEvent()} title="Edit user name">
                  Edit</div>
                }
              </span>}

              {userNameEdit &&
              <span className="d-flex">
                <input type="text" id="userNameEditInput" placeholder="User Name . . ." value={this.state.userName}
                       className={"username-edit-input mr-2 " + (errMsg.length > 0 ? "username-edit-input-warning" : "")}
                       onChange={(e) => this.handleChangeUsername(e)} spellCheck= "false" maxLength="20"/>
                <div onClick={() => this.handleEditBtn()} className="username-edit-btn mr-2">Done</div>
                <div onClick={() => this.handleCancelEvent()} className="username-cancel-btn">Cancel</div>
                {errMsg.length > 0 && <div className="username-edit-input-warning-msg">{errMsg}</div>}
              </span>
              }
            </div>

            <div className="profile_info_desc">
              Total balance :
              <span className="color">
                <BalanceOfContainer balance={balance}/>
              </span>
              <br/>
              Estimated earnings for today :
              <span className="color">
                <DollarWithDeck deck={Number(authorTodayReward || 0) + Number(curatorEstimatedToday || 0)}/>
              </span>
              <br/>Revenue for the last 7 days :
              <span className="color">
                <DollarWithDeck deck={Number(author7DayReward || 0) + Number(curatorTotalRewards || 0)}/>
              </span>
            </div>
          </div>
        </div>


        <div className="row">
          <div className=" profile-creator col-sm-12 col-md-6">
            <h5>Author rewards</h5>
            <div className="profile_info_desc">
              Estimated earnings for today : <span><DollarWithDeck deck={authorTodayReward}/></span>
              <br/>Revenue for the last 7 days : <span><DollarWithDeck deck={author7DayReward}/></span>
            </div>
          </div>


          <div className=" profile-curator col-sm-12 col-md-6">
            <h5>Curator rewards</h5>
            <div className="profile_info_desc">
              Estimated earnings for today : <span><DollarWithDeck deck={curatorEstimatedToday}/></span>

              <br/>Revenue for the last 7 days : <span><DollarWithDeck deck={curatorTotalRewards}/></span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreatorSummary;
