import React, { Component } from "react";
import MainRepository from "../../../redux/MainRepository";
import history from "apis/history/history";
import Spinner from "react-spinkit";

class Callback extends Component {
  componentWillMount(): void {
    // 최초 로그인 시 redux 에 myInfo 저장 필요. callback.jsx 는 Main.jsx 에 route 되기 때문에,  Main.jsx 의 init 함수가 끝난 뒤에 호출됨.

    MainRepository.Account.handleAuthentication(this.props, () => {
      let myInfo = MainRepository.Account.getMyInfo();
      MainRepository.Account.getAccountInfo(myInfo.sub, result => {
        this.props.setMyInfo(result);
        history.push("/latest");
      });
    });
  }

  render() {

    return (
      <div className="callback-wrapper">
        <Spinner name="ball-pulse-sync"/>
      </div>
    );
  }
}

export default Callback;