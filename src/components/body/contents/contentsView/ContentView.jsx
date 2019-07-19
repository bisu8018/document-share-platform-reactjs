import React from "react";
import { ThreeBounce } from "better-react-spinkit";
import { Helmet } from "react-helmet";
import { APP_PROPERTIES } from "properties/app.properties";

import ContentViewRight from "./ContentViewRight";
import MainRepository from "../../../../redux/MainRepository";
import common from "../../../../config/common";
import NotFoundPage from "../../../common/NotFoundPage";
import ContentViewFullScreenContainer
  from "../../../../container/body/contents/contentsView/ContentViewFullScreenContainer";


class ContentView extends React.Component {
  state = {
    documentTitle: null,
    documentData: null,
    totalViewCountInfo: null,
    errMessage: null,
    documentText: null,
    author: null,
    featuredList: null
  };

  getContentInfo = (seoTitle) => {
    this.setState({ documentTitle: seoTitle });
    MainRepository.Document.getDocument(seoTitle, (res) => {
      this.setState({
        documentTitle: res.document.seoTitle,
        documentData: res.document,
        totalViewCountInfo: res.totalViewCountInfo,
        featuredList: common.shuffleArray(res.featuredList),
        documentText: res.text,
        author: res.document.author,
        errMessage: null
      }, () => {
        this.checkUrl(res);
        this.setDocumentIsExist();  //문서 로드 후 문서 블록체인 등록 체크
      });
    }, err => {
      this.setState({
        documentTitle: null,
        documentData: null,
        totalViewCountInfo: null,
        errMessage: err,
        documentText: null,
        author: null,
        featuredList: null
      });
      console.error(err);
      setTimeout(() => {
        this.getContentInfo(seoTitle);
      }, 8000);
    });
  };

  setDocumentIsExist = () => {
    const { getWeb3Apis } = this.props;
    const { documentData } = this.state;
    getWeb3Apis.isDocumentExist(documentData.documentId, res => {
      this.props.setIsDocumentExist(res);
    });
  };

  getSeoTitle = () => {
    return this.props.match.params.documentId;
  };

  getImgUrl = () => {
    const { documentData } = this.state;
    return common.getThumbnail(documentData.documentId, 640, 1, documentData.documentName);
  };

  checkUrl = (res) => {
    if (this.getSeoTitle() !== res.document.seoTitle) window.history.replaceState({}, res.document.seoTitle, APP_PROPERTIES.domain().mainHost + "/" + res.document.author.username + "/" + res.document.seoTitle);
  };


  componentWillMount() {
    if (!this.state.documentData) this.getContentInfo(this.getSeoTitle());
  }


  // 해당 이벤트는 See Also 이동 시에만 발생
  componentDidUpdate = () => {
    const { documentTitle, errMessage } = this.state;
    let titleFromUrl = window.location.pathname.split("/")[2];

    if (titleFromUrl !== documentTitle && !errMessage) {
      this.getContentInfo(titleFromUrl);
    }
  };


  render() {
    const { auth, match, ...rest } = this.props;
    const { documentData, documentText, totalViewCountInfo, featuredList, author, errMessage } = this.state;
    if (!documentData && !errMessage) {
      return (<div className="spinner"><ThreeBounce color="#3681fe" name="ball-pulse-sync"/></div>);
    }
    if (!documentData && errMessage) {
      return (errMessage && <NotFoundPage errMessage={errMessage}/>);
    }


    return (

      <div data-parallax="true" className="container_view row col-re">
        <Helmet>
          <title>{documentData.title}</title>
        </Helmet>

        <div className="col-md-12 col-lg-8 view_left">
          <ContentViewFullScreenContainer documentData={documentData} documentText={documentText}
                                          totalViewCountInfo={totalViewCountInfo}
                                          auth={auth} author={author}/>
        </div>

        <div className="col-md-12 col-lg-4 ">
          <ContentViewRight documentData={documentData} author={author} featuredList={featuredList} {...rest}/>
        </div>
      </div>

    );
  }
}

export default ContentView;
