import React from "react";
import { APP_PROPERTIES } from "properties/app.properties";
import DollarWithDeck from "../../../common/amount/DollarWithDeck";
import MainRepository from "../../../../redux/MainRepository";
import Common from "../../../../config/common";
import BalanceOfContainer from "../../../../container/common/BalanceOfContainer";
import { psString } from "../../../../config/localization";
import log from "../../../../config/log";

class CreatorSummary extends React.Component {
  state = {
    balance: -1,
    profileImage: "",
    userName: "",
    userNameEdit: false,
    errMsg: "",
    author7DayReward: null,
    authorTodayReward: null,
    curatorEstimatedToday: null,
    curatorTotalRewards: null
  };


  // 초기화
  init = () => {
    const { userInfo } = this.props;
    this.setState({ userName: userInfo.username, profileImage: userInfo.picture }, () => log.CreatorSummary.init());
  };


  //유저 네임 유효성 체크
  userNameValidate = (name) => {
    if (!name || name.length < 1)
      this.setState({ errMsg: psString("profile-error-1") }, () => false);

    if (!Common.checkUsernameForm(name))
      this.setState({ errMsg: psString("profile-error-2") }, () => false);

    if (name.length < 4 || name.length > 20)
      this.setState({ errMsg: psString("profile-error-3") }, () => false);

    if (this.state.errMsg !== "")
      this.setState({ errMsg: "" }, () => true);

    return name;
  };


  // 내 정보 GET
  getMyInfo = () => MainRepository.Account.getMyInfo();


  // 크리에이터 7일간 리워드
  setAuthor7DayReward = (docList, pool, countInfo) => this.setState({ author7DayReward: Common.toDeck(Common.getAuthor7DaysTotalReward(docList, pool, countInfo)) });


  // 크리에이터 하루 리워드
  setAuthorTodayReward = (docList, pool, countInfo) => this.setState({ authorTodayReward: Common.toDeck(Common.getAuthorNDaysTotalReward(docList, pool, countInfo, 0)) });


  // 큐레이터 7일간 리워드
  setCuratorEstimatedToday = (docList, pool, countInfo, voteList) => this.setState({ curatorEstimatedToday: Common.toDeck(Common.getCuratorNDaysTotalReward(docList, pool, countInfo, 0, voteList, 1)) });


  // 큐레이터 하루 리워드
  setCuratorTotalRewards = (docList, pool, countInfo, voteList) => this.setState({ curatorTotalRewards: Common.toDeck(Common.getCurator7DaysTotalReward(docList, pool, countInfo, voteList)) });


  // 리워드 조회
  getRewards = () => {
    const { getCreatorDailyRewardPool, getCuratorDailyRewardPool, uploadTotalViewCountInfo, uploadDocumentList, voteDocumentList, voteTotalViewCountInfo, latestRewardVoteList } = this.props;
    const { author7DayReward, authorTodayReward, curatorEstimatedToday, curatorTotalRewards } = this.state;

    if (uploadDocumentList && getCreatorDailyRewardPool && uploadTotalViewCountInfo) {
      if (author7DayReward === null) this.setAuthor7DayReward(uploadDocumentList, getCreatorDailyRewardPool, uploadTotalViewCountInfo);
      if (authorTodayReward === null) this.setAuthorTodayReward(uploadDocumentList, getCreatorDailyRewardPool, uploadTotalViewCountInfo);
    }
    if (voteDocumentList && getCuratorDailyRewardPool && voteTotalViewCountInfo && latestRewardVoteList) {
      if (curatorEstimatedToday === null) this.setCuratorEstimatedToday(voteDocumentList, getCuratorDailyRewardPool, voteTotalViewCountInfo, latestRewardVoteList);
      if (curatorTotalRewards === null) this.setCuratorTotalRewards(voteDocumentList, getCuratorDailyRewardPool, voteTotalViewCountInfo, latestRewardVoteList);
    }
  };


  // 잔액 조회
  getBalance = () => {
    const { getWeb3Apis, userInfo } = this.props;
    const { balance } = this.state;

    if (!userInfo.ethAccount || balance >= 0) return false;

    getWeb3Apis.getBalance(userInfo.ethAccount, res => this.setState({ balance: res }, () => log.CreatorSummary.getBalance()));
    return true;
  };


  // file upload
  handleFileUpload = () => document.getElementById("imgFile").click();


  //file input 등록/변경 시, url get
  handleFileChange = (e) => {
    const file = e[0];

    // upload url GET
    MainRepository.Account.getProfileImageUploadUrl().then(result => {
      let params = { file: file, signedUrl: result.signedUploadUrl };

      // 이미지 서버에 업로드
      MainRepository.Account.profileImageUpload(params, () => {
        let url = APP_PROPERTIES.domain().profile + result.picture;

        // 유저 정보 업데이트
        MainRepository.Account.updateProfileImage(url, () => this.setState({ profileImage: url }));
      }, () => document.getElementById("imgFile").value = null);

    }).catch(err => {
      console.error(err);
      document.getElementById("imgFile").value = null;
    });
  };


  //username 수정 시
  handleClickEvent = () => this.setState({ userNameEdit: true }, () => document.getElementById("userNameEditInput").focus());


  //username 수정 취소 시
  handleCancelEvent = () => this.setState({ userName: this.props.userInfo.username, userNameEdit: false, errMsg: "" });


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
  handleChangeUsername = (e) => this.setState({ userName: this.userNameValidate(e.target.value) });


  shouldComponentUpdate = () => {
    this.getBalance(); // 잔액 조회
    return true;
  };


  componentWillMount(): void {
    this.init();
  }

  render() {
    const { userInfo } = this.props;
    const { author7DayReward, authorTodayReward, curatorEstimatedToday, curatorTotalRewards, balance, userNameEdit, userName, profileImage, errMsg } = this.state;

    this.getRewards();

    return (

      <div className="profile_container">
        <div className="profile-top-wrapper"/>
        <div className="row  profile_top">
          <div className="col-12 col-sm-2 col-lg-1 ">
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
              <span className={!userNameEdit ? "d-flex" : "d-none"}>
                <strong>{userName || userInfo.email}</strong>
                {this.getMyInfo().email === userInfo.email &&
                <div className="username-edit-btn ml-2" onClick={() => this.handleClickEvent()}>
                  {psString("profile-edit")}</div>
                }
              </span>
              <span className={userNameEdit ? "d-flex" : "d-none"}>
                <input type="text" id="userNameEditInput" placeholder="User Name . . ." value={this.state.userName}
                       className={"username-edit-input mr-2 " + (errMsg.length > 0 ? "username-edit-input-warning" : "")}
                       onChange={(e) => this.handleChangeUsername(e)} spellCheck="false" maxLength="20"/>
                <div onClick={() => this.handleEditBtn()} className="username-edit-btn mr-2">Done</div>
                <div onClick={() => this.handleCancelEvent()} className="username-cancel-btn">Cancel</div>
                {errMsg.length > 0 && <div className="username-edit-input-warning-msg">{errMsg}</div>}
              </span>
            </div>

            <div className="profile_info_desc">
              {psString("profile-total-balance")}
              <span className="color">
                <BalanceOfContainer balance={balance}/>
              </span>
              <br/>
              {psString("profile-estimated-earnings")}
              <span className="color ml-1">
                <DollarWithDeck deck={Number(authorTodayReward || 0) + Number(curatorEstimatedToday || 0)}/>
              </span>
              <br/>
              {psString("profile-revenue-7-days")}
              <span className="color ml-1">
                <DollarWithDeck deck={Number(author7DayReward || 0) + Number(curatorTotalRewards || 0)}/>
              </span>
            </div>
          </div>
        </div>


        <div className="row">
          <div className=" profile-creator col-sm-12 col-md-6">
            <h5>{psString("profile-author-rewards")}</h5>
            <div className="profile_info_desc">
              {psString("profile-estimated-earnings")}
              <span className="ml-1"><DollarWithDeck deck={authorTodayReward}/></span>
              <br/>
              {psString("profile-revenue-7-days")}
              <span className="ml-1"><DollarWithDeck deck={author7DayReward}/></span>
            </div>
          </div>


          <div className=" profile-curator col-sm-12 col-md-6">
            <h5>{psString("profile-curator-rewards")}</h5>
            <div className="profile_info_desc">
              {psString("profile-estimated-earnings")}
              <span className="ml-1"><DollarWithDeck deck={curatorEstimatedToday}/></span>
              <br/>
              {psString("profile-revenue-7-days")}
              <span className="ml-1"><DollarWithDeck deck={curatorTotalRewards}/></span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreatorSummary;
