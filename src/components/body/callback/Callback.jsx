import React, { Component } from "react";
import MainRepository from "../../../redux/MainRepository";
import history from "apis/history/history";
import LoadingModal from "../../common/modal/LoadingModal";

class Callback extends Component {

  // 초기화
  init = () => {
    const { setAlertCode, setMyInfo, setMyList, setHistory } = this.props;
    // 최초 로그인 시 redux 에 myInfo 저장 필요. callback.jsx 는 Main.jsx 에 route 되기 때문에,  Main.jsx 의 init 함수가 끝난 뒤에 호출됨.
    if (MainRepository.Account.isAuthenticated()) return false;

    MainRepository.Account.handleAuthentication(this.props)
      .then(sub => {
        MainRepository.Account.getAccountInfo(sub).then(result => {
          let res = result.user;
          if (!res.username || !res.username === "") res.username = res.email;
          res.privateDocumentCount = result.privateDocumentCount;
          if (!res.picture) res.picture = localStorage.getItem("user_info").picture;

          // 로그인 성공시, 유사 로그인 정보 삭제
          setMyInfo(res);   // 나의 정보 SET
          MainRepository.Document.getMyList({userId : res.sub}).then(res => setMyList({ resultList: res }));   // 나의 찜한 목록 SET
          MainRepository.Document.getHistory({userId: res.sub}).then(res => setHistory({ resultList: res }));   // 나의 히스토리 목록 SET
          history.push("/@" + res.username);
        });
      }).catch(err => {
      console.log("err",err);
      setAlertCode(2004);
      history.push("/");
    });
  };


  componentWillMount(): void {
    this.init();
  }


  render() {
    return (<LoadingModal/>);
  }
}

export default Callback;
