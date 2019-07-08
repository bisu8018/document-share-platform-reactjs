import React from "react";
import { psString } from "../../../config/localization";

class Alert extends React.PureComponent {

  state = {
    status: "",    //error, warning, success,
    msg: "",
    sub: ""
  };

  handleClose = () => {
    const { close } = this.props;
    close();
  };

  componentWillMount() {
    const { code } = this.props;

    let msg = "";
    let sub = "";
    let status = "";
    switch (code) {

      //=============================================
      //클라이언트 단 상태코드
      //=============================================
      // 시스템 메세지 2000~
      case 2001 :
        status = "error";
        msg = psString("alert-2001");   // 네트워크 에러
        break;

      case 2002 :
        status = "error";
        msg = psString("alert-2002");   // 잘못된 접근경로
        break;

      case 2003 :
        status = "warning";
        msg = psString("alert-2003");   // 로그인 필요
        break;

      // 이메일 메세지 2031~
      case 2021 :
        status = "success";
        msg = psString("alert-2021");   // 이메일 검증 성공
        break;

      case 2022 :
        status = "error";
        msg = psString("alert-2022");   // 이메일 검증 실패
        break;

      case 2023 :
        status = "warning";
        msg = psString("alert-2023");   // 이메일 이미 검증
        break;

      case 2024 :
        status = "warning";
        msg = psString("alert-2024");   // 잘못된 검증 코드
        break;


      // 블록체인 메세지 2031~
      case 2031 :
        status = "warning";
        msg = psString("alert-2031");   // 투표가능액 초과
        break;

      case 2032 :
        status = "error";
        msg = psString("alert-2032");   // 트랜잭션 실패
        break;

      case 2033 :
        status = "error";
        msg = psString("alert-2033");   // 승인 트랜잭션 실패
        break;

      case 2034 :
        status = "error";
        msg = psString("alert-2034");   // 투표 트랜잭션 실패
        break;

      case 2035 :
        status = "error";
        msg = psString("alert-2035");   // 클레임 트랜잭션 실패
        break;


      //지갑 메세지 2050~
      case 2051 :
        status = "warning";
        msg = psString("alert-2051");   // 잘못된 메타마스크
        sub = psString("alert-2051-sub");
        break;

      case 2052 :
        status = "warning";
        msg = psString("alert-2052");  // 잘못된 이더리움 네트워크 접속
        sub = psString("alert-2052-sub");
        break;



      //=============================================
      //서버 단 상태코드
      //=============================================

      default :
        break;
    }

    this.setState({ status: status, msg: msg, sub: sub }, () => {
        this.setInterval = setInterval(() => {
          this.handleClose();
          clearInterval(this.setInterval);
        }, 7000);
      }
    );
  }

  render() {
    const { msg, status, sub } = this.state;
    let alertStatus = "alert-" + status;
    return (

      <div className={"alert-wrapper " + alertStatus}>
        <div className="alert">
          <span className="mr-2">
            <i className="material-icons">{status === "success" ? "check" : status}</i>
          </span>
          <span>{msg}</span>
          <i className="material-icons alert-close" title="close" onClick={() => this.handleClose()}>close</i>

        </div>

        {sub !== "" &&
        <div className="alert-explain mb-2">
          {sub}
        </div>
        }
      </div>

    );
  }
}

export default Alert;
