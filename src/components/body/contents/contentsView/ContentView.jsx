import React from "react";
import { Helmet } from "react-helmet";
import { APP_PROPERTIES } from "properties/app.properties";

import ContentViewSeeAlso from "./ContentViewSeeAlso";
import MainRepository from "../../../../redux/MainRepository";
import common from "../../../../common/common";
import history from "apis/history/history";
import ContentViewFullScreenContainer
  from "../../../../container/body/contents/contentsView/ContentViewFullScreenContainer";
import log from "../../../../config/log";
import AwayModal from "../../../common/modal/AwayModal";
import ContentViewFullScreenMock from "../../../common/mock/ContentViewFullScreenMock";
import ContentViewSeeAlsoMock from "../../../common/mock/ContentViewSeeAlsoMock";
import { psString } from "../../../../config/localization";


class ContentView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      documentTitle: null,
      documentData: null,
      totalViewCountInfo: null,
      documentText: null,
      author: null,
      featuredList: null,
      update: null
    };
  }


  // 초기화
  init = () => {
    log.ContentView.init();

    if (APP_PROPERTIES.ssr) return;

    let presentValue = this.getParam();

    // @ 통해서 프로필 접근 허용
    if (presentValue[0] !== "@")
      this.wrongAccess();
    if (!this.state.documentData)
      this.getContentInfo(this.getSeoTitle())
        .then(res => this.setHistory(res));
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


  // 문서 우져 히스토리 SET
  setHistory = res => {
    if (MainRepository.Account.isAuthenticated()) MainRepository.Mutation.addHistory(res.documentId);
  };


  // 문서 정보 GET
  getContentInfo = seoTitle =>
    new Promise(resolve => {
      this.setState({ documentTitle: seoTitle, update: true });
      MainRepository.Document.getDocument(seoTitle)
        .then(res => {
          log.ContentView.getContentInfo(null, res);

          if (res.document.state !== "CONVERT_COMPLETE") {
            this.setStateClear();
            this.pushNotFoundPage();
          }

          this.setState({
            documentTitle: res.document.seoTitle,
            documentData: res.document,
            totalViewCountInfo: res.totalViewCountInfo,
            featuredList: common.shuffleArray(res.featuredList),
            documentText: res.text,
            author: res.document.author,
            update: false
          }, () => {
            if (this.getSeoTitle() !== res.document.seoTitle) this.checkUrl(res);
            resolve(res.document);
          });
        }).catch(err => {
        log.ContentView.getContentInfo(err);
        this.setStateClear(err);
        this.pushNotFoundPage();
      });
    });


  // SEO TITLE GET
  getSeoTitle = () => this.props.match.params.documentId;


  // 이미지 URL GET
  getImgUrl = () => {
    const { documentData } = this.state;
    return common.getThumbnail(documentData.documentId, 640, 1, documentData.documentName);
  };


  //state clear
  setStateClear = () => this.setState({
    documentTitle: null,
    documentData: null,
    totalViewCountInfo: null,
    documentText: null,
    author: null,
    featuredList: null
  });


  // push 404
  pushNotFoundPage = () => {
    if (!APP_PROPERTIES.ssr) history.push("/n");
  };


  // URL 검사
  checkUrl = res => window.history.replaceState({}, res.document.seoTitle, APP_PROPERTIES.domain().mainHost + "/" + res.document.author.username + "/" + res.document.seoTitle);


  componentWillMount() {
    this.init();
  }


  componentDidUpdate = () => {
    const { documentTitle } = this.state;
    let titleFromUrl = window.location.pathname.split("/")[2];

    // See Also 이동 시에만 발생
    if (decodeURI(titleFromUrl) !== documentTitle)
      this.getContentInfo(decodeURI(titleFromUrl));
  };


  render() {
    const { auth, match, getAway, ...rest } = this.props;
    const { documentData, documentText, totalViewCountInfo, featuredList, author, update } = this.state;

    if (documentData) {
      return (
        <section data-parallax="true" className="container_view row col-re container">
          <Helmet>
            <title>{documentData.title}</title>
          </Helmet>

          {getAway && <AwayModal documentData={documentData}/>}

          <ContentViewFullScreenContainer documentData={documentData} documentText={documentText}
                                          totalViewCountInfo={totalViewCountInfo} update={update}
                                          auth={auth} author={author}/>

          <ContentViewSeeAlso documentData={documentData} author={author}
                              featuredList={featuredList} {...rest}/>
        </section>

      );
    } else {
      return (
        <section data-parallax="true" className="container_view row col-re container">
          <ContentViewFullScreenMock/>
          <ContentViewSeeAlsoMock/>
        </section>
      );
    }


  }
}

export default ContentView;
