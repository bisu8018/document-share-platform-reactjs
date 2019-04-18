import React from "react";
import { APP_PROPERTIES } from 'properties/app.properties';
import DollarWithDeck from "../../../common/DollarWithDeck";
import MainRepository from "../../../../redux/MainRepository";
import Common from "../../../../util/Common";
import BalanceOfContainer from "../../../../container/body/profile/author/BalanceOfContainer";

class AuthorSummary extends React.Component {
  state = {
    totalViewCount: null,
    balance: -1,

    profileImage: "",
    userName: "",
    userNameEdit: false,
    uploadDocumentList: [],
    rewardsFlag: false,
    authorRewardPoolFlag: false,
    authorEstimatedToday: null,
    authorTotalRewards: 0,
    curatorRewardPoolFlag: false,
    curatorEstimatedToday: null,
    curatorTotalRewards: 0,
  };

  // 내 정보 GET
  getMyinfo = () => {
    return MainRepository.Account.getMyInfo();
  };

  // 잔액 조회
  getBalance = () => {
    const { accountId, getWeb3Apis } = this.props;
    if (this.state.balance < 0 && accountId) {
      getWeb3Apis.getBalance(accountId, res => {
        this.setState({ balance: Number(res) });
      });
    }
  };

  // Author 7일간 총 리워드 계산
  getAuthorTotalRewards = () => {
    const { uploadDocumentList, getWeb3Apis } = this.props;
    const { rewardsFlag } = this.state;

    if (this.state.uploadDocumentList.length === 0 && !rewardsFlag && uploadDocumentList) {
      this.setState({ uploadDocumentList: uploadDocumentList, rewardsFlag: true }, () => {
        if (this.state.uploadDocumentList.length > 0) {
          getWeb3Apis.getAuthorTotalRewards(uploadDocumentList, 7, result => {
            this.setState({ authorTotalRewards: result });
          });
        }
      });
    }
  };

  // Curator 7일간 총 리워드 계산
  getCuratorTotalRewards = () => {
    const { uploadDocumentList, getWeb3Apis } = this.props;
    const { rewardsFlag } = this.state;

    if (this.state.uploadDocumentList.length === 0 && !rewardsFlag && uploadDocumentList) {
      this.setState({ uploadDocumentList: uploadDocumentList, rewardsFlag: true }, () => {
        if (this.state.uploadDocumentList.length > 0) {
          getWeb3Apis.getCuratorTotalRewards(uploadDocumentList, 7, result => {
            this.setState({ curatorTotalRewards: result });
          });
        }
      });
    }
  };

  //Author 오늘 리워드 추정
  getAuthorEstimatedRewards = () => {
    const { uploadDocumentList, getWeb3Apis, uploadTotalViewCountInfo } = this.props;
    const { authorEstimatedToday, authorRewardPoolFlag } = this.state;

    if (authorEstimatedToday !== null || authorRewardPoolFlag || !uploadDocumentList) return;
    let calculateRewardSum = 0;

    getWeb3Apis.getAuthorDailyRewardPool(res => {
      this.setState({ authorRewardPoolFlag: true }, () => {
        let pv;
        let tpv = uploadTotalViewCountInfo ? uploadTotalViewCountInfo.totalPageview : 0;
        for (let i = 0; i < uploadDocumentList.length; ++i) {
          pv = uploadDocumentList[i].latestPageview;
          calculateRewardSum += Common.authorCalculateReward(pv, tpv, res);
          if (i === uploadDocumentList.length - 1) this.setState({ authorEstimatedToday: calculateRewardSum });
        }
      });
    });
  };

  //Curator 오늘 리워드 추정
  getCuratorEstimatedRewards = () => {
    const { uploadDocumentList, uploadTotalViewCountInfo, getWeb3Apis } = this.props;
    const { curatorEstimatedToday, curatorRewardPoolFlag } = this.state;

    if (curatorEstimatedToday !== null || curatorRewardPoolFlag || !uploadDocumentList) return;
    let calculateRewardSum = 0;

    getWeb3Apis.getCuratorDailyRewardPool(res => {
      this.setState({ curatorRewardPoolFlag: true }, () => {
        let v, pv;
        let tpvs = uploadTotalViewCountInfo ? uploadTotalViewCountInfo.totalPageviewSquare : 0;
        let tv = uploadTotalViewCountInfo ? uploadTotalViewCountInfo.totalPageview : 0;
        for (let i = 0; i < uploadDocumentList.length; ++i) {
          pv = uploadDocumentList[i].latestPageview;
          v = uploadDocumentList[i].latestVoteAmount;
          calculateRewardSum += Common.curatorCalculateReward(res, v, tv, pv, tpvs);
          if (i === uploadDocumentList.length - 1) this.setState({ curatorEstimatedToday: calculateRewardSum });
        }
      });
    });
  };

  //보상액 설정
  setReward = () => {
    this.getBalance();    // 잔액 조회
    this.getAuthorTotalRewards();     // Author 7일간 총 리워드 계산
    this.getAuthorEstimatedRewards();     // Author 오늘 리워드 추정액
    this.getCuratorTotalRewards();     // Curator 7일간 총 리워드 계산
    this.getCuratorEstimatedRewards();     // Curator 오늘 리워드 추정액
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
        let url = APP_PROPERTIES.domain.profile + result.picture;
        // 유저 정보 업데이트
        MainRepository.Account.updateProfileImage(url, rst => {
          this.setState({ profileImage: url });
        });
      }, error => {
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

  shouldComponentUpdate(nextProps, nextState) {
    this.setReward();
    return true;
  }

  componentWillMount(): void {
    const { userInfo } = this.props;
    this.setState({ userName: userInfo.username });
    this.setState({ profileImage: userInfo.picture });
  }

  render() {
    const { userInfo } = this.props;
    const { balance, authorEstimatedToday, authorTotalRewards, curatorTotalRewards, curatorEstimatedToday, userNameEdit, userName, profileImage } = this.state;

    let author7DayReward = Common.toEther(authorTotalRewards);
    let authorTodayReward = Common.toEther(authorEstimatedToday);
    let curator7DayReward = Common.toEther(curatorTotalRewards);
    let curatorTodayReward = Common.toEther(curatorEstimatedToday);

    return (

      <div className="profile_container">
        <div className="row  profile_top">


          <div className="col-12 col-md-2 ">
            <div className="profile-image">
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
                <span className="username-edit-btn" onClick={() => this.handleClickEvent()}>
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
              * Total balance :
              <span className="color">
                <BalanceOfContainer balance={balance}/>
              </span>
              <br/>
              * Estimated earnings for today :
              <span className="color">
                <DollarWithDeck deck={authorTodayReward}/>
              </span>
              <br/>* Revenue for the last 7 days :
              <span className="color"> $0.00 </span>
            </div>
          </div>
        </div>


        <div className="row">
          <div className=" profile_creator col-sm-12 col-md-6">
            <h5>Author rewards</h5>
            <div className="profile_info_desc">
              * Estimated earnings for today : <span><DollarWithDeck deck={authorTodayReward}/></span>
              <br/>* Revenue for the last 7 days : <span><DollarWithDeck deck={author7DayReward}/></span>
            </div>
          </div>


          <div className=" profile_creator col-sm-12 col-md-6">
            <h5>Curator rewards</h5>
            <div className="profile_info_desc">
              * Estimated earnings for today : <span><DollarWithDeck deck={curatorTodayReward}/></span>

              <br/>* Revenue for the last 7 days : <span><DollarWithDeck deck={curator7DayReward}/></span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AuthorSummary;
