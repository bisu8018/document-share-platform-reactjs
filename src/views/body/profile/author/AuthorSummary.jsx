import React from "react";
import Web3Apis from "apis/Web3Apis";
import BalanceOf from "./BalanceOf";
import DollarWithDeck from "../../../../components/common/DollarWithDeck";
import MainRepository from "../../../../redux/MainRepository";

class AuthorSummary extends React.Component {
  state = {
    totalBalanceDataKey: null,
    totalAuthor3DayReward: 0,
    authorEstimatedToday: 0,
    curatorEstimatedToday: 0,
    todayVotedDocuments: null,
    totalViewCount: null,
    balance: -1,
    profileImage: "",
    userName: "",
    userNameEdit: false
  };

  web3Apis = new Web3Apis();

  // 잔액 조회
  getBalance = () => {
    const { accountId } = this.props;

    if (this.state.balance < 0) {
      this.web3Apis.getBalance(accountId).then((data) => {
        this.setState({ balance: Number(data) });
      }).catch((err) => {
      });
    }
  };

  getMyinfo = () => {
    return MainRepository.Account.getMyInfo();
  };

  // 리워드 계산
  getCalculateAuthorReward = () => {
    const { documentList, accountId, totalViewCountInfo } = this.props;
    const { authorEstimatedToday, totalAuthor3DayReward } = this.state;
    let viewCount = 0;
    let _totalAuthor3DayReward = 0;
    const blockchainTimestamp = this.web3Apis.getBlockchainTimestamp(new Date());
    for (const idx in documentList) {
      const document = documentList[idx];
      if (!isNaN(document.viewCountUpdated) && document.viewCountUpdated > blockchainTimestamp) {
        const docViewCount = isNaN(document.viewCount) ? 0 : Number(document.viewCount);
        viewCount += docViewCount;
        //console.log("viewCount", document.documentId, docViewCount, viewCount);
      }

      _totalAuthor3DayReward += isNaN(document.confirmAuthorReward) ? 0 : Number(document.confirmAuthorReward);

    }
    if (_totalAuthor3DayReward > totalAuthor3DayReward) {
      this.setState({ totalAuthor3DayReward: _totalAuthor3DayReward });
    }


    if (!authorEstimatedToday && totalViewCountInfo) {
      let address = accountId;
      this.web3Apis.getCalculateAuthorReward(address, viewCount, totalViewCountInfo.totalViewCount).then((data) => {
        this.setState({ authorEstimatedToday: data });

      }).catch((err) => {
        console.error(err);
      });
    }
  };

  safeNumber = (num) => {
    return (typeof num == "number") ? num : 0;
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
        let url = "https://profile.share.decompany.io/" + result.picture;

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

  handleCancelEvent = () => {
    const { userInfo } = this.props;
    this.setState({ userName: userInfo.username });
    this.setState({ userNameEdit: false });
  };

  handleEditBtn = () => {
    let userNameValue = document.getElementById("userNameEditInput").value;
    MainRepository.Account.updateUsername(userNameValue, () => {
      this.setState({ userNameEdit: false });
      this.setState({ userName: userNameValue });
    });
  };

  handleChangeUsername = (e) => {
    this.setState({ userName: e.target.value });
  };

  shouldComponentUpdate(nextProps, nextState) {
    this.getBalance();
    this.getCalculateAuthorReward();
    return true;
  }

  componentWillMount(): void {
    const { userInfo } = this.props;
    this.setState({ userName: userInfo.username });
    this.setState({ profileImage: userInfo.picture });
  }

  render() {
    const { classes, userInfo, drizzleApis, totalCurator3DayReward, totalCuratorEstimateRewards, ...others } = this.props;
    const { totalAuthor3DayReward, balance, authorEstimatedToday, userNameEdit, userName, profileImage } = this.state;

    let author3DayReward = drizzleApis.toEther(totalAuthor3DayReward);
    let authorTodayReward = drizzleApis.toEther(authorEstimatedToday);
    let curator3DayReward = drizzleApis.toEther(totalCurator3DayReward);
    let curatorTodayReward = drizzleApis.toEther(totalCuratorEstimateRewards);

    let sumReward = 0;
    sumReward += this.safeNumber(author3DayReward);
    sumReward += this.safeNumber(authorTodayReward);
    sumReward += this.safeNumber(curator3DayReward);
    sumReward += this.safeNumber(curatorTodayReward);

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
              * Total balance : <span className="color"><BalanceOf balance={balance} sumReward={sumReward}
                                                                   drizzleApis={drizzleApis} {...others}/></span>
              <br/>* Estimated earnings for today : <span className="color"><DollarWithDeck deck={authorTodayReward}
                                                                                            drizzleApis={drizzleApis} {...others}/></span>
              <br/>* Revenue for the last 7 days : <span className="color"> $0.00 </span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className=" profile_creator col-sm-12 col-md-6">
            <h5>Author rewards</h5>
            <div className="profile_info_desc">
              * Estimated earnings for today : <span><DollarWithDeck deck={authorTodayReward}
                                                                     drizzleApis={drizzleApis} {...others}/></span>
              <br/>* Revenue for the last 7 days : <span><DollarWithDeck deck={author3DayReward}
                                                                         drizzleApis={drizzleApis} {...others}/></span>
            </div>
          </div>
          <div className=" profile_creator col-sm-12 col-md-6">
            <h5>Curator rewards</h5>
            <div className="profile_info_desc">
              * Estimated earnings for today : <span><DollarWithDeck deck={curatorTodayReward}
                                                                     drizzleApis={drizzleApis} {...others}/></span>

              <br/>* Revenue for the last 7 days : <span><DollarWithDeck deck={curator3DayReward}
                                                                         drizzleApis={drizzleApis} {...others}/></span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AuthorSummary;
