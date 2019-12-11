import React from "react";
import DollarWithDeck from "../../../common/amount/DollarWithDeck";
import MainRepository from "../../../../redux/MainRepository";
import Common from "../../../../common/common";
import BalanceOfContainer from "../../../../container/common/BalanceOfContainer";
import { psString } from "../../../../config/localization";
import log from "../../../../config/log";
import MyAvatar from "../../../common/avatar/MyAvatar";
import { FadingCircle } from "better-react-spinkit";
import { APP_PROPERTIES } from "../../../../properties/app.properties";
import Tooltip from "@material-ui/core/Tooltip";


class CreatorSummary extends React.Component {
  state = {
    balance: -1,
    userName: "",
    userNameEdit: false,
    editLoading: false,
    errMsg: "",
    last7CreatorReward: null,
    todayEstimatedCreatorReward: null,
    todayEstimatedCuratorReward: null,
    last7CuratorReward: null
  };


  // 초기화
  init = () => {
    const { userInfo } = this.props;
    this.setState({ userName: userInfo.username }, () => log.CreatorSummary.init());
    this.getRewards();
    this.getBalance();
  };


  //유저 네임 유효성 체크
  userNameValidate = value => {
    if (!value || value.length < 1)
      return this.setState({ errMsg: psString("profile-error-1") }, () => false);

    if (!Common.checkUsernameForm(value))
      return this.setState({ errMsg: psString("profile-error-2") }, () => false);

    if (value.length < 4 || value.length > 20) {
      console.log(value);
      return this.setState({ errMsg: psString("profile-error-3") }, () => false);
    }

    if (this.state.errMsg !== "")
      this.setState({ errMsg: "" }, () => true);

    return value;
  };


  // 내 정보 GET
  getMyInfo = () => MainRepository.Account.getMyInfo();


  // 리워드 조회
  getRewards = () => {
    const { userInfo } = this.props;

    MainRepository.Wallet.getProfileRewards(userInfo.sub).then(res => {
      let creatorReward = this.getCalculatedReward(res.last7CreatorReward);
      let curatorReward = this.getCalculatedReward(res.last7CuratorReward);

      this.setState({
        last7CreatorReward: creatorReward,
        last7CuratorReward: curatorReward,
        todayEstimatedCreatorReward: res.todayEstimatedCreatorReward.reward || 0,
        todayEstimatedCuratorReward: res.todayEstimatedCuratorReward.reward || 0
      });
    });
  };

  getCalculatedReward = value => {
    if (value && value.length > 0) {
      let { reward } = value.reduce((prev, value) => prev.reward + value.reward);
      return reward;
    } else {
      return 0;
    }
  };


  // 잔액 조회
  getBalance = () => {
    const { userInfo } = this.props;
    const { balance } = this.state;

    if (balance >= 0) return false;

    MainRepository.Wallet.getWalletBalance({ userId: userInfo.sub })
      .then(res =>
        this.setState({ balance: res.wei }, () => log.CreatorSummary.getBalance()));
    return true;
  };


  // file upload
  handleFileUpload = () => document.getElementById("imgFile").click();


  //file input 등록/변경 시, url get
  handleFileChange = async e => {
    if (e && e.length > 0)
      this.props.setModal("imageCrop", { file: e[0] });
  };


  //username 수정 시
  handleClickEvent = () => this.setState({ userNameEdit: true }, () => document.getElementById("userNameEditInput").focus());


  //username 수정 취소 시
  handleCancelEvent = () => this.setState({ userName: this.props.userInfo.username, userNameEdit: false, errMsg: "" });


  //수정 버튼 핸들
  handleEditBtn = () => {
    this.setState({ editLoading: true });

    let name = document.getElementById("userNameEditInput").value;
    if (this.userNameValidate(name) && this.state.errMsg === "") {
      let userNameValue = document.getElementById("userNameEditInput").value;
      MainRepository.Account.updateUsername(userNameValue)
        .then(() => {
          this.props.setAlertCode(2141);
          this.setState({ userNameEdit: false, editLoading: true });
          this.setState({ userName: userNameValue });
          window.history.replaceState({}, {}, APP_PROPERTIES.domain().mainHost + "/@" + userNameValue);
        }).catch(err => this.props.setAlertCode());
    }
  };


  //유져네임 수정 상태 핸들
  handleChangeUsername = value => this.setState({ userName: this.userNameValidate(value) });


  componentWillMount(): void {
    this.init();
  }


  render() {
    const { userInfo, getIsMobile, setModal } = this.props;
    const { last7CreatorReward, editLoading, todayEstimatedCreatorReward, todayEstimatedCuratorReward, last7CuratorReward, balance, userNameEdit, userName, errMsg } = this.state;

    return (

      <div className="profile_container">
        <div className="profile-top-wrapper"/>
        <div className="row  profile_top pt-4">
          <div className="col-12 col-md-2 col-lg-1 ">
            <MyAvatar size={90} picture={userInfo.picture} croppedArea={userInfo.croppedArea}/>
            {this.getMyInfo().email === userInfo.email &&
            <div className="profile-image-edit" onClick={this.handleFileUpload}>
              <i className="material-icons">edit</i>
            </div>
            }
            {this.getMyInfo().email === userInfo.email &&
            <input type="file" id="imgFile" accept="image/*" onChange={(e) => this.handleFileChange(e.target.files)}
                   onClick={e => e.target.value = null}/>
            }
          </div>


          <div className="col-12 col-md-10 col-lg-11 ">
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
                       onChange={(e) => this.handleChangeUsername(e.target.value)} spellCheck="false" maxLength="20"/>
                <div onClick={() => this.handleEditBtn()}
                     className={"username-edit-btn mr-2 " + (!editLoading ? "" : "btn-disabled")}>
                  {!editLoading ? "Done" : <FadingCircle color="#3681fe" size={17}/>}
                </div>
                {!editLoading &&
                <div onClick={() => this.handleCancelEvent()} className="username-cancel-btn">Cancel</div>}
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
                <DollarWithDeck
                  deck={Number(todayEstimatedCreatorReward || 0) + Number(todayEstimatedCuratorReward || 0)}/>
              </span>
              <br/>
              {psString("profile-revenue-7-days")}
              <span className="color ml-1">
                <DollarWithDeck deck={Number(last7CreatorReward || 0) + Number(last7CuratorReward || 0)}/>
              </span>
            </div>

            {this.getMyInfo().email === userInfo.email && userInfo.ethAccount === "" &&
            <div className="deposit-btn-wrapper">
              <Tooltip title={psString("async-modal-title")} placement="bottom">
                <div className={"claim-btn " + (getIsMobile ? " w-100" : "")}
                     onClick={() => setModal("async")}>
                  {psString("common-modal-async")}
                </div>
              </Tooltip>
            </div>
            }
            {this.getMyInfo().email === userInfo.email && userInfo.ethAccount !== "" &&
            <div className="deposit-btn-wrapper">
              <Tooltip title={psString("deposit-modal-title")} placement="bottom">
                <div className={"claim-btn " + (getIsMobile ? " w-100" : "")}
                     onClick={() => setModal("deposit")}>
                  {psString("common-modal-deposit")}
                </div>
              </Tooltip>
              <Tooltip title={psString("withdraw-modal-title")} placement="bottom">
                <div className={"claim-btn mt-2 " + (getIsMobile ? " w-100" : "")}
                     onClick={() => setModal("withdraw")}>
                  {psString("common-modal-withdraw")}
                </div>
              </Tooltip>
            </div>
            }
          </div>
        </div>

        <div className="row">
          <div className=" profile-creator col-sm-12 col-md-6">
            <h5>{psString("profile-author-rewards")}</h5>
            <div className="profile_info_desc">
              {psString("profile-estimated-earnings")}
              <span className="ml-1"><DollarWithDeck deck={todayEstimatedCreatorReward}/></span>
              <br/>
              {psString("profile-revenue-7-days")}
              <span className="ml-1"><DollarWithDeck deck={last7CreatorReward}/></span>
            </div>
          </div>


          <div className=" profile-curator col-sm-12 col-md-6">
            <h5>{psString("profile-curator-rewards")}</h5>
            <div className="profile_info_desc">
              {psString("profile-estimated-earnings")}
              <span className="ml-1"><DollarWithDeck deck={todayEstimatedCuratorReward}/></span>
              <br/>
              {psString("profile-revenue-7-days")}
              <span className="ml-1"><DollarWithDeck deck={last7CuratorReward}/></span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreatorSummary;
