import React from "react";
import { ThreeBounce } from "better-react-spinkit";
import { Helmet } from "react-helmet";
import { APP_PROPERTIES } from "properties/app.properties";

import ContentViewRight from "./ContentViewRight";
import MainRepository from "../../../../redux/MainRepository";
import common from "../../../../common/common";
import NotFoundPage from "../../../common/NotFoundPage";
import ContentViewFullScreenContainer
  from "../../../../container/body/contents/contentsView/ContentViewFullScreenContainer";
import log from "../../../../config/log";


class ContentView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      documentTitle: null,
      documentData: null,
      totalViewCountInfo: null,
      errMessage: null,
      documentText: null,
      author: null,
      featuredList: null,
      update: null
    };
  }


  // 초기화
  init = () => {
    log.ContentView.init();
    if (!this.state.documentData) this.getContentInfo(this.getSeoTitle());
  };


  // 문서 정보 GET
  getContentInfo = (seoTitle) => {
    this.setState({ documentTitle: seoTitle, update: true });
    return MainRepository.Document.getDocument(seoTitle)
      .then(res => {
        log.ContentView.getContentInfo(null, res);
        this.setState({
          documentTitle: res.document.seoTitle,
          documentData: res.document,
          totalViewCountInfo: res.totalViewCountInfo,
          featuredList: common.shuffleArray(res.featuredList),
          documentText: res.text,
          author: res.document.author,
          errMessage: null,
          update: false
        }, () => {
          if (this.getSeoTitle() !== res.document.seoTitle) this.checkUrl(res);
        });
      }).catch(err => {
        log.ContentView.getContentInfo(err);
        this.setStateClear(err);
        this.setTimeout = setTimeout(() => {
          this.getContentInfo(seoTitle);
          clearTimeout(this.setTimeout);
        }, 8000);
      });
  };


  // SEO TITLE GET
  getSeoTitle = () => this.props.match.params.documentId;


  // 이미지 URL GET
  getImgUrl = () => {
    const { documentData } = this.state;
    return common.getThumbnail(documentData.documentId, 640, 1, documentData.documentName);
  };


  //state clear
  setStateClear = err => this.setState({
    documentTitle: null,
    documentData: null,
    totalViewCountInfo: null,
    errMessage: err,
    documentText: null,
    author: null,
    featuredList: null
  });


  // URL 검사
  checkUrl = res => window.history.replaceState({}, res.document.seoTitle, APP_PROPERTIES.domain().mainHost + "/" + res.document.author.username + "/" + res.document.seoTitle);


  componentWillMount() {
    this.init();
  }


  componentDidUpdate = () => {
    const { documentTitle, errMessage } = this.state;
    let titleFromUrl = window.location.pathname.split("/")[2];

    // See Also 이동 시에만 발생
    if (decodeURI(titleFromUrl) !== documentTitle && !errMessage)
      this.getContentInfo(decodeURI(titleFromUrl));
  };


  render() {
    const { auth, match, ...rest } = this.props;
    const { documentData, documentText, totalViewCountInfo, featuredList, author, errMessage, update } = this.state;

    if (!documentData && !errMessage)
      return (<div className="spinner"><ThreeBounce color="#3681fe" name="ball-pulse-sync"/></div>);

    if ((!documentData && errMessage) || (documentData && documentData.state !== "CONVERT_COMPLETE"))
      return (errMessage && <NotFoundPage errMessage={errMessage}/>);


    return (
      <section data-parallax="true" className="container_view row col-re container">
        <Helmet>
          <title>{documentData.title}</title>
        </Helmet>

        <ContentViewFullScreenContainer documentData={documentData} documentText={documentText}
                                        totalViewCountInfo={totalViewCountInfo} update={update}
                                        auth={auth} author={author}/>


        <ContentViewRight documentData={documentData} author={author}
                          featuredList={featuredList} {...rest}/>

      </section>

    );
  }
}

export default ContentView;
