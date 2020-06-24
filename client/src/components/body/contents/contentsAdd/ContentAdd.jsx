import React from "react";
import { psString } from "../../../../config/localization";
import MainRepository from "../../../../redux/MainRepository";
import ContentEditorContainer from "../../../../container/body/contents/contentsAdd/ContentEditorContainer";


class ContentAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      titleError: "",
      identifier: null,
      desc: "",
      init: false
    };
  }


  // 초기화
  init = () => {
    const { getMyInfo } = this.props;

    if (!MainRepository.Account.isAuthenticated()) {
      MainRepository.Account.login();
    } else {
      this.setState({ init: true, identifier: getMyInfo.username || getMyInfo.email }, () => {
        if (getMyInfo.privateDocumentCount > 0) this.props.setAlertCode(2074);
        document.getElementById("docTitle").focus();
      });
    }
  };


  // GET 포스팅 내용
  getDesc = content => this.setState({ desc: content });


  // 업로드 버튼 관리, input 값 유효성 검사
  handlePublishBtn = () => {
    if (!this.validateFile() || !this.validateTitle()) return false;
  };


  // 제목 변경 관리
  handleTitleChange = e => this.setState({ title: e.target.value }, () => this.validateTitle());


  // 설명 수정 관리
  handleDescChange = e => this.setState({ desc: e.target.value });


  //제목 유효성 체크
  validateTitle = () => {
    const { title } = this.state;
    this.setState({ titleError: title.length > 0 ? "" : psString("edit-doc-error-1") });
    return title.length > 0;
  };


  // 프라이빗 문서 보유수 체크
  checkPrivateDoc = res =>
    this.setState({ privateDocCount: res.privateDocumentCount }, () => {
      this.setState({ classicModalSub: true });  //두번째 모달 열기
    });


  componentWillMount(): void {
    this.init();
  }


  render() {
    const { titleError,  title, desc, init } = this.state;

    if (!init) return <div/>;

    return (
      <div className="row container container-add pt-4 mb-5">


        <div className="col-12 mt-4">
          <input type="text" autoComplete="off" placeholder={psString("common-modal-title")} id="docTitle"
                 className={"custom-input-content-add-title " + (titleError.length > 0 ? "custom-input-warning" : "")}
                 onChange={e => this.handleTitleChange(e)}/>
          <span>{titleError}</span>
        </div>


        {(title.length > 0 || desc.length > 0) &&
        <div className="col-12 mb-5">
          <ContentEditorContainer getDesc={content => this.getDesc(content)}/>
        </div>}


        <div onClick={() => this.handlePublishBtn()} id="contentAddPublish"/>
      </div>
    );
  }
}

export default ContentAdd;
