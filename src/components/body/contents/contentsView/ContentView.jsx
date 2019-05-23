import React from "react";
import { ThreeBounce } from 'better-react-spinkit';
import { Helmet } from "react-helmet";

import ContentViewRight from "./ContentViewRight";
import MainRepository from "../../../../redux/MainRepository";
import Common from "../../../../util/Common";
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
    featuredList: null,
  };

  getContentInfo = (documentId) => {
    this.setState({ documentTitle: documentId });
    MainRepository.Document.getDocument(documentId, (res) => {
      this.setState({
        documentTitle: res.document.seoTitle,
        documentData: res.document,
        totalViewCountInfo: res.totalViewCountInfo,
        featuredList: res.featuredList,
        documentText: res.text,
        author: res.document.author,
        errMessage: null
      }, () => {
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
        featuredList: null,
      });
    });
  };

  setDocumentIsExist = () => {
    const { getWeb3Apis } = this.props;
    const { documentData } = this.state;
    getWeb3Apis.isDocumentExist(documentData.documentId, res => {
      this.props.setIsDocumentExist(res);
    });
  };

  getDocumentId = () => {
    const { match } = this.props;
    return match.params.documentId;
  };

  getImgUrl = () => {
    const { documentData } = this.state;
    return Common.getThumbnail(documentData.documentId, 640, 1, documentData.documentName);
  };

  componentWillMount() {
    if (!this.state.documentData) {
      this.getContentInfo(this.getDocumentId());
    }
  }

  // 해당 이벤트는 See Also 이동 시에만 발생
  componentDidUpdate = () => {
    const { documentTitle, errMessage } = this.state;
    let oldDocumentId = documentTitle;
    let newDocumentId = window.location.pathname.split("/")[2];
    if (newDocumentId !== oldDocumentId && !errMessage) {
      this.getContentInfo(newDocumentId);
    }
  };

  render() {
    const { auth, match, ...rest } = this.props;
    const { documentData, documentText, totalViewCountInfo, featuredList, author, errMessage } = this.state;
    if (!documentData && !errMessage) {
      return (<div className="spinner"><ThreeBounce name="ball-pulse-sync"/></div>);
    }
    if (!documentData && errMessage) {
      return (errMessage && <NotFoundPage errMessage={errMessage}/>);
    }

    return (

      <div data-parallax="true" className="container_view row col-re">
        <Helmet>
          <meta charSet="utf-8"/>
          <title>{documentData.seoTitle}</title>
          <meta name="description" content={documentData.desc}/>
          <meta name="thumbnail" content={this.getImgUrl()}/>
          <link rel="canonical"
                href={window.location.href}/>

          <meta content="2237550809844881" className="fb_og_meta" property="fb:app_id" name="fb_app_id"/>
          <meta content="decompany:document" className="fb_og_meta" property="og:type" name="og_type"/>
          <meta content={window.location.href} className="fb_og_meta" property="og:url" name="og_url"/>
          <meta content={this.getImgUrl()} className="fb_og_meta" property="og:image" name="og_image"/>
          <meta content={documentData.title} className="fb_og_meta" property="og:title" name="og_title"/>
          <meta content={documentData.desc} className="fb_og_meta" property="og:description" name="og_description"/>
          <meta content={Common.timestampToDateTime(documentData.created)} className="fb_og_meta"
                property="decompany:created_time" name="document_created_time"/>
          <meta content={documentData.username || documentData.accountId} className="fb_og_meta" property="decompany:author"
                name="document_created_time_author"/>
          <meta content={documentData.viewCount} className="fb_og_meta" property="decompany:view_count"
                name="document_view_count"/>
          <meta content={documentData.totalPages} className="fb_og_meta" property="decompany:total_pages"
                name="document_total_pages"/>
          <meta content={documentData.latestPageView} className="fb_og_meta" property="decompany:latest_page_view"
                name="document_latest_page_view"/>
          <meta content={documentData.category} className="fb_og_meta" property="decompany:category"
                name="document_category"/>
          <meta content={documentData.tags} className="fb_og_meta" property="decompany:tags" name="document_tags"/>
        </Helmet>

        <div className="col-md-12 col-lg-8 view_left">
          <ContentViewFullScreenContainer documentData={documentData} documentText={documentText} totalViewCountInfo={totalViewCountInfo}
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
