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
    uploadDocumentList: [],
    curatorEstimatedToday: 0,
    curatorTotalRewards: 0
  };

  // 내 정보 GET
  getMyinfo = () => {
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

  // Curator 오늘 리워드 예측
  getCuratorRewards = () => {
    const { userInfo, getCuratorDailyRewardPool } = this.props;
    MainRepository.Curator.getCuratorSummary(userInfo.ethAccount).then(res => {
      this.setState({
        curatorEstimatedToday: Common.toDeck(Common.getCuratorNDaysTotalReward(res.resultList, getCuratorDailyRewardPool, res.totalViewCountInfo, 0,res.voteDocList)),
        curatorTotalRewards: Common.toDeck(Common.getCurator7DaysTotalReward(res.resultList, getCuratorDailyRewardPool, res.totalViewCountInfo,res.voteDocList))
      });
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
    this.setState({ userName: userInfo.username });
    this.setState({ userNameEdit: false });
  };

  //수정 버튼 핸들
  handleEditBtn = () => {
    let userNameValue = document.getElementById("userNameEditInput").value;
    MainRepository.Account.updateUsername(userNameValue, () => {
      this.setState({ userNameEdit: false });
      this.setState({ userName: userNameValue });
    });
  };

  //유져네임 수정 상태 핸들
  handleChangeUsername = (e) => {
    this.setState({ userName: e.target.value });
  };

  shouldComponentUpdate = () => {
    this.getBalance();    // 잔액 조회
    return true;
  };

  componentWillMount(): void {
    const { userInfo } = this.props;

    this.setState({ userName: userInfo.username });
    this.setState({ profileImage: userInfo.picture });

    this.getCuratorRewards();
  }

  render() {
    const { userInfo, getCreatorDailyRewardPool, uploadTotalViewCountInfo, uploadDocumentList } = this.props;
    const { balance, curatorTotalRewards, curatorEstimatedToday, userNameEdit, userName, profileImage } = this.state;

    let author7DayReward = Common.toDeck(Common.getAuthor7DaysTotalReward(uploadDocumentList, getCreatorDailyRewardPool, uploadTotalViewCountInfo));
    let authorTodayReward = Common.toDeck(Common.getAuthorNDaysTotalReward(uploadDocumentList, getCreatorDailyRewardPool, uploadTotalViewCountInfo, 0));

    return (

      <div className="profile_container">
        <div className="row  profile_top">
          <div className="profile-top-wrapper"/>
          <div className="col-12 col-md-2 ">
            <div className="profile-image" title="Change profile image">
              <img src={profileImage} alt="profile" className="img-fluid"/>
              {this.getMyinfo().email === userInfo.email &&
              <div className="profile-image-edit" onClick={this.handleFileUpload}><i className="material-icons">edit</i>
              </div>
              }
            </div>
            {this.getMyinfo().email === userInfo.email &&
            <input type="file" id="imgFile" accept="image/*" onChange={(e) => this.handleFileChange(e.target.files)}/>
            }
          </div>


          <div className="col-12 col-md-10 ">
            <div className="profile_info_name">
              {!userNameEdit &&
              <span>
                <strong>{userName || userInfo.email}</strong>
                {this.getMyinfo().email === userInfo.email &&
                <span className="username-edit-btn" onClick={() => this.handleClickEvent()} title="Edit user name">
                  <i className="material-icons ml-2">edit</i>
                </span>
                }
              </span>}

              {userNameEdit &&
              <span>
                <input type="text" id="userNameEditInput" placeholder="User Name . . ." value={this.state.userName}
                       className="username-edit-input mr-2" onChange={(e) => this.handleChangeUsername(e)}/>
                <div onClick={() => this.handleEditBtn()} className="ok-btn d-inline-block">Edit</div>
                <div onClick={() => this.handleCancelEvent()} className="cancel-btn d-inline-block">Cancel</div>
              </span>}
            </div>

            <div className="profile_info_desc">
              Total balance :
              <span className="color">
                <BalanceOfContainer balance={balance}/>
              </span>
              <br/>
              Estimated earnings for today :
              <span className="color">
                <DollarWithDeck deck={ Number(authorTodayReward || 0) + Number(curatorEstimatedToday || 0)}/>
              </span>
              <br/>Revenue for the last 7 days :
              <span className="color">
                <DollarWithDeck deck={ Number(author7DayReward || 0) + Number(curatorTotalRewards || 0)}/>
              </span>
            </div>
          </div>
        </div>


        <div className="row">
          <div className=" profile_creator col-sm-12 col-md-6">
            <h5>Author rewards</h5>
            <div className="profile_info_desc">
              Estimated earnings for today : <span><DollarWithDeck deck={authorTodayReward}/></span>
              <br/>Revenue for the last 7 days : <span><DollarWithDeck deck={author7DayReward}/></span>
            </div>
          </div>


          <div className=" profile_creator col-sm-12 col-md-6">
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
