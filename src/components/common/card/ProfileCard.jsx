import React from "react";
import BalanceOfContainer from "../../../container/common/BalanceOfContainer";
import { Link } from "react-router-dom";
import MainRepository from "../../../redux/MainRepository";
import UserInfo from "../../../redux/model/UserInfo";
import Common from "../../../config/common";

class ProfileCard extends React.Component {
  state = {
    balance: -1
  };


  // 잔액 조회
  getBalance = () => {
    const { getWeb3Apis, getMyInfo } = this.props;
    const { balance } = this.state;
    let address = getMyInfo.ethAccount;
    if (!address || balance > 0) return false;

    getWeb3Apis.getBalance(getMyInfo.ethAccount, res => {
      this.setState({ balance: res });
    });
  };


  handleLogout = () => {
    const { setMyInfo } = this.props;

    if (MainRepository.Account.isAuthenticated()) {
      MainRepository.Account.logout(() => {
        setMyInfo(new UserInfo());
      });
    } else {
      window.location.reload();
    }

  };


  componentWillMount(): void {
    this.getBalance();    // 잔액 조회
  }


  render() {
    const { getMyInfo, getTempEmail } = this.props;
    const { balance } = this.state;

    let identification = (getMyInfo.username.length && getMyInfo.username.length > 0 ? getMyInfo.username : getMyInfo.email);

    return (
      <div className="profile-card tac" id="profileCard">
        <div className="mt-4 mb-4">


          {MainRepository.Account.isAuthenticated() ?
            getMyInfo.picture.length > 0 ?
              <img src={getMyInfo.picture} className="profile-card-avatar" alt="profile"/> :
              <img src={require("assets/image/icon/i_anonymous.png")} className="profile-card-avatar" alt="profile"/>

            :

              <div className="profile-card-avatar-init">{getTempEmail[0]}</div>
          }


          <div className="profile-card-username mt-2">
            {MainRepository.Account.isAuthenticated() ? identification : getTempEmail}
          </div>
        </div>

        <div className="mb-4">
          <div className="profile-card-total-balance">
            Total Balance
          </div>
          <BalanceOfContainer balance={balance}/>
        </div>

        <div>
          {MainRepository.Account.isAuthenticated() ?
            <Link to={"/" + identification}>
              <div className="my-account-btn mb-2" id="profileCardMyAccountBtn" onClick={() => Common.scrollTop()}>
                My page
              </div>
            </Link> :
            <div className="my-account-btn mb-2" onClick={() => MainRepository.Account.login()}> Login </div>
          }
          <div className="profile-card-logout-btn" onClick={() => this.handleLogout()}>Sign out</div>
        </div>

      </div>


    );
  }
}

export default ProfileCard;
