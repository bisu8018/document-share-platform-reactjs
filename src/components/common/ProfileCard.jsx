import React from "react";
import BalanceOfContainer from "../../container/common/BalanceOfContainer";
import { Link } from "react-router-dom";
import MainRepository from "../../redux/MainRepository";
import UserInfo from "../../redux/model/UserInfo";

class ProfileCard extends React.Component {
  state = {
    balance: -1
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

  handleLogout = () => {
    const {setMyInfo} = this.props;

    MainRepository.Account.logout(() => {
      setMyInfo(new UserInfo());
    });
  };


  shouldComponentUpdate = () => {
    this.getBalance();    // 잔액 조회
    return true;
  };

  render() {
    const { getMyInfo } = this.props;
    const { balance } = this.state;

    return (
      <div className="profile-card tac" id="profileCard">
        <div className="mt-4 mb-4">
          {getMyInfo.picture.length > 0 ?
            <img src={getMyInfo.picture} className="profile-card-avatar" alt="profile"/> :
            <img src={require("assets/image/common/i_anonymous.png")} className="profile-card-avatar" alt="profile"/>
          }
          <div className="profile-card-username mt-2">
            {getMyInfo.username}
          </div>
        </div>

        <div className="mb-4">
          <div className="profile-card-total-balance">
            Total Balance
          </div>
          <BalanceOfContainer balance={balance}/>
        </div>

        <div>
          <Link to={"/" + (getMyInfo.username.length && getMyInfo.username.length > 0 ? getMyInfo.username : getMyInfo.email)}>
            <div className="my-account-btn mb-2" id="profileCardMyAccountBtn">My account</div>
          </Link>
          <div className="profile-card-logout-btn" onClick={() => this.handleLogout()}>Sign out</div>
        </div>

      </div>


    );
  }
}

export default ProfileCard;