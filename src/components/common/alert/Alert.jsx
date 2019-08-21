import React from "react";
import { psString } from "../../../config/localization";

class Alert extends React.PureComponent {

  state = {
    status: "",    //error, warning, success,
    msg: "",
    sub: ""
  };


  // 메세지 GET
  getMsg = (code) => psString("alert-" + code);


  // 종료 관리
  handleClose = () => this.props.close();


  componentWillMount() {
    const { code, getMyInfo, alertData } = this.props;

    let msg = "", sub = "", status = "";

    switch (code) {

      //=============================================
      //클라이언트 단 상태코드
      //=============================================


      // 시스템 메세지 2000~
      case 2001 :
        status = "error";
        msg = this.getMsg(code);   // 네트워크 에러
        break;

      case 2002 :
        status = "error";
        msg = this.getMsg(code);   // 잘못된 접근경로
        break;

      case 2003 :
        status = "warning";
        msg = this.getMsg(code);   // 로그인 필요
        break;

      case 2004 :
        status = "error";
        msg = this.getMsg(code);   // 로그인 필요
        break;

      case 2005 :
        status = "success";
        msg = this.getMsg(code);   // 복사 성공
        break;


      // 이메일 메세지 2031~
      case 2021 :
        status = "success";
        msg = this.getMsg(code);   // 이메일 검증 성공
        break;

      case 2022 :
        status = "error";
        msg = this.getMsg(code);   // 이메일 검증 실패
        break;

      case 2023 :
        status = "warning";
        msg = this.getMsg(code);   // 이메일 이미 검증
        break;

      case 2024 :
        status = "warning";
        msg = this.getMsg(code);   // 잘못된 검증 코드
        break;


      // 블록체인 메세지 2031~
      case 2031 :
        status = "warning";
        msg = this.getMsg(code);   // 투표가능액 초과
        break;

      case 2032 :
        status = "error";
        msg = this.getMsg(code);   // 트랜잭션 실패
        break;

      case 2033 :
        status = "error";
        msg = this.getMsg(code);   // 승인 트랜잭션 실패
        break;

      case 2034 :
        status = "error";
        msg = this.getMsg(code);   // 투표 트랜잭션 실패
        break;

      case 2035 :
        status = "error";
        msg = this.getMsg(code);   // 클레임 트랜잭션 실패
        break;

      case 2036 :
        status = "warning";
        msg = this.getMsg(code);   // 클레임 트랜잭션 실패
        break;

      case 2037 :
        status = "warning";
        msg = this.getMsg(code);   // 클레임 트랜잭션 실패
        break;


      //지갑 메세지 2051~
      case 2051 :
        status = "warning";
        msg = this.getMsg(code);   // 잘못된 메타마스크
        sub = psString("alert-" + code + "-sub");
        break;

      case 2052 :
        status = "warning";
        msg = this.getMsg(code);  // 잘못된 이더리움 네트워크 접속
        sub = psString("alert-" + code + "-sub");
        break;

      case 2053 :
        status = "warning";
        msg = this.getMsg(code);  // 토큰 잔액 부족
        sub = psString("alert-" + code + "-sub");
        break;


      //업로드 메세지 2071~
      case 2071 :
        status = "error";
        msg = this.getMsg(code);   // 업로드 싪패
        break;
      case 2072 :
        status = "error";
        msg = this.getMsg(code);   // 비공개 문서 허용 5개 초과
        break;
      case 2073 :
        status = "error";
        msg = this.getMsg(code);   // 문서 삭제 실패
        break;
      case 2074 :
        status = "success";
        msg = this.getMsg(code);   // 비공개 문서 개수
        sub = psString("alert-2074-sub-a") + getMyInfo.privateDocumentCount + psString("alert-2074-sub-b");
        break;
      case 2075 :
        status = "success";
        msg = this.getMsg(code);   // 컴파일 성공
        sub = alertData.title;
        break;
      case 2076 :
        status = "success";
        msg = this.getMsg(code);   // 문서 삭제 성공
        break;


      //문서 관련 메세지 2091~
      case 2091 :
        status = "error";
        msg = this.getMsg(code);   // 다운로드 싪패
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
