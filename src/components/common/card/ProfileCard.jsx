import React from "react";
import BalanceOfContainer from "../../../container/common/BalanceOfContainer";
import MainRepository from "../../../redux/MainRepository";
import { psString } from "../../../config/localization";
import { FadingCircle } from "better-react-spinkit";
import MyAvatar from "../avatar/MyAvatar";


class ProfileCard extends React.Component {
  state = {
    balance: -1,
    loading: false
  };


  // 잔액 조회
  getBalance = () => {
    const { getMyInfo } = this.props;
    const { balance } = this.state;

    if ( balance > 0) return false;

    this.setState({ loading: true });
    MainRepository.Wallet.getWalletBalance({ userId: getMyInfo.sub }).then(res =>
      this.setState({ balance: res.wei, loading: false }));
  };


  componentWillMount(): void {
    this.getBalance();    // 잔액 조회
  }


  render() {
    const { getMyInfo, getTempEmail } = this.props;
    const { balance, loading } = this.state;

    let identification = (getMyInfo.username.length && getMyInfo.username.length > 0 ? getMyInfo.username : getMyInfo.email);

    return (
      <div className='profile-card tac' id='profileCard'>
        <div className='mt-4 mb-4'>
          <MyAvatar size={90} picture={getMyInfo.picture} croppedArea={getMyInfo.croppedArea} tempEmail={getTempEmail}/>
          <div className='profile-card-username mt-2'>
            {MainRepository.Account.isAuthenticated() ? identification : getTempEmail}
          </div>
        </div>


        <div className='mb-4'>
          <div className='profile-card-total-balance'>{psString("profile-card-total-balance")}</div>
          {!loading ?
            <BalanceOfContainer balance={balance}/> :
            <div className='profile-card-loading-wrapper'><FadingCircle color='#3681fe'/></div>
          }
        </div>


        <div>
          {MainRepository.Account.isAuthenticated() ?
            <div className='my-account-btn mb-2' id='profileCardMyAccountBtn'
                 data-id={identification}>{psString("profile-card-my-page")}</div> :
            <div className='my-account-btn mb-2'
                 onClick={() => MainRepository.Account.login()}> {psString("profile-card-login")} </div>
          }
          <div className='profile-card-logout-btn'
               onClick={() => MainRepository.Account.logout()}>{psString("profile-card-logout")}</div>
        </div>
      </div>


    );
  }
}

export default ProfileCard;
