import React from "react";
import { Helmet } from "react-helmet";
import { APP_PROPERTIES } from "properties/app.properties";
import MainRepository from "../../../../redux/MainRepository";
import common from "../../../../common/common";
import history from "apis/history/history";
import ContentViewFullScreenContainer
  from "../../../../container/body/contents/contentsView/ContentViewFullScreenContainer";
import log from "../../../../config/log";
import AwayModal from "../../../common/modal/AwayModal";
import ContentViewFullScreenMock from "../../../common/mock/ContentViewFullScreenMock";
import { psString } from "../../../../config/localization";


class ContentView extends React.Component {

  // 초기화
  init = () => {
    log.ContentView.init();

    if (APP_PROPERTIES.ssr) return false;

    // @ 통해서 프로필 접근 허용
    if (this.getParam()[0] !== "@")
      this.wrongAccess();

    if (!this.props.getDocument.document.documentTitle)
      this.getContentInfo(this.props.match.params.documentId).then(res => this.setHistory(res));
  };


  // 잘못된 접근, 404 페이지 이동
  wrongAccess = () => {
    this.props.setAlertCode(2002);
    this.props.history.push({
      pathname: "/n",
      state: { errMessage: psString("profile-err-1") }
    });
  };


  // URL 파라미터 유저 identification GET
  getParam = () => decodeURI(window.location.pathname.split("/")[1]);


  // 문서 유져 히스토리 SET
  setHistory = res => {
    if (MainRepository.Account.isAuthenticated()) MainRepository.Mutation.addHistory(res.documentId);
  };


  // 문서 정보 GET
  getContentInfo = seoTitle =>
    new Promise(resolve => {
      MainRepository.Document.getDocument(seoTitle)
        .then(res => {
          log.ContentView.getContentInfo(null, res);

          if (res.document.state !== "CONVERT_COMPLETE")
            this.pushNotFoundPage();

          this.props.setDocument(res);
          if (!APP_PROPERTIES.ssr && this.getSeoTitle() !== res.document.seoTitle) this.checkUrl(res);
          resolve(res.document);
        }).catch(err => {
        log.ContentView.getContentInfo(err);
        this.pushNotFoundPage();
      });
    });


  // SEO TITLE GET
  getSeoTitle = () => this.props.match.params.documentId;


  // 이미지 URL GET
  getImgUrl = () => {
    const { getDocument } = this.props;
    return common.getThumbnail(getDocument.document.documentId, 640, 1, getDocument.document.documentName);
  };


  // push 404
  pushNotFoundPage = () => {
    if (!APP_PROPERTIES.ssr) history.push("/n");
  };


  // URL 검사
  checkUrl = res => window.history.replaceState({}, res.document.seoTitle, APP_PROPERTIES.domain().mainHost + "/" + res.document.author.username + "/" + res.document.seoTitle);


  componentWillMount() {
    this.init();
  }


  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    const { getDocument, match } = this.props;

    if (getDocument.document.seoTitle !== this.getSeoTitle()) {
      this.getContentInfo(match.params.documentId);
    }
  }


  render() {
    const { getDocument, auth, getAway } = this.props;

    if (APP_PROPERTIES.ssr || getDocument.document.seoTitle === this.getSeoTitle()) {
      return (
        <section data-parallax="true" className="container_view row col-re container">
          <Helmet>
            <title>{getDocument.document.title}</title>
          </Helmet>

          {getAway && <AwayModal documentData={getDocument.document}/>}

          <ContentViewFullScreenContainer auth={auth}/>
        </section>
      );
    } else {
      return (
        <section data-parallax="true" className="container_view row col-re container">
          <ContentViewFullScreenMock/>
        </section>
      );
    }
  }
}

export default ContentView;
