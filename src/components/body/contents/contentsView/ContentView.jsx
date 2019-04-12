import React from "react";
import Spinner from "react-spinkit";
import { Helmet } from "react-helmet";
import Web3Apis from "apis/Web3Apis";

import ContentViewFullScreen from "./ContentViewFullScreen";
import ContentViewRight from "./ContentViewRight";
import MainRepository from "../../../../redux/MainRepository";
import Common from "../../../../util/Common";
import NotFoundPage from "../../../common/NotFoundPage";


class ContentView extends React.Component {
  state = {
    documentTitle: null,
    documentData: null,
    errMessage: null,
    documentText: null,
    author: null,
    determineAuthorToken: -1,
    featuredList: null,
    approved: -1
  };

  web3Apis = new Web3Apis();

  getContentInfo = (documentId) => {
    this.setState({ documentTitle: documentId });
    MainRepository.Document.getDocument(documentId, (res) => {
      this.setState({
        documentTitle: res.document.seoTitle,
        documentData: res.document,
        featuredList: res.featuredList,
        documentText: res.text,
        author: res.author,
        determineAuthorToken: -1,
        approved: -1,
        errMessage : null
      });
    }, err => {
      this.setState({
        documentTitle: null,
        documentData: null,
        errMessage: err,
        documentText: null,
        author: null,
        determineAuthorToken: -1,
        featuredList: null,
        approved: -1
      });
    });
  };

  getApproved = () => {
    const { drizzleApis } = this.props;
    if (drizzleApis.getLoggedInAccount() && this.state.approved < 0) {
      this.web3Apis.getApproved(drizzleApis.getLoggedInAccount()).then((data) => {
        this.setState({ approved: data });
      }).catch((err) => {
        console.log("getApproved Error", err);
      });
    }
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

  shouldComponentUpdate = () => {
    this.getApproved();
    return true;
  };

  // 해당 이벤트는 See Also 이동 시에만 발생
  componentDidUpdate = () => {
    const { documentTitle, errMessage  } = this.state;
    let oldDocumentId = documentTitle;
    let newDocumentId = window.location.pathname.split("/")[2];
    if (newDocumentId !== oldDocumentId && !errMessage) {
      this.getContentInfo(newDocumentId);
    }
  };

  render() {
    const { drizzleApis, auth, match, ...rest } = this.props;
    const { documentData, documentText, featuredList, author, errMessage } = this.state;
    if (!documentData && !errMessage) {
      return (<div className="spinner"><Spinner name="ball-pulse-sync"/></div>);
    }
    if (!documentData && errMessage) {
      return  (errMessage && <NotFoundPage errMessage={ errMessage }/>);
    }

    return (

      <div data-parallax="true" className="container_view row col-re">
        <Helmet>
          <meta charSet="utf-8"/>
          <title>{documentData.seoTitle}</title>
          <meta name="description" content={documentData.desc}/>
          <meta name="thumbnail" content={this.getImgUrl()}/>
          <link rel="canonical" href={"https://share.decompany.io/" + match.params.identification + "/" + match.params.seoTitle}/>

          <meta content="2237550809844881" class="fb_og_meta" property="fb:app_id" name="fb_app_id"/>
          <meta content="decompany:document" class="fb_og_meta" property="og:type" name="og_type"/>
          <meta content={window.location.href} class="fb_og_meta" property="og:url" name="og_url"/>
          <meta content={this.getImgUrl()} class="fb_og_meta" property="og:image" name="og_image"/>
          <meta content={documentData.title} class="fb_og_meta" property="og:title" name="og_title"/>
          <meta content={documentData.desc} class="fb_og_meta" property="og:description" name="og_description"/>
          <meta content={Common.timestampToDateTime(documentData.created)} class="fb_og_meta"
                property="decompany:created_time" name="document_created_time"/>
          <meta content={documentData.username || documentData.accountId} class="fb_og_meta" property="decompany:author"
                name="document_created_time_author"/>
          <meta content={documentData.viewCount} class="fb_og_meta" property="decompany:view_count"
                name="document_view_count"/>
          <meta content={documentData.totalPages} class="fb_og_meta" property="decompany:total_pages"
                name="document_total_pages"/>
          <meta content={documentData.latestPageView} class="fb_og_meta" property="decompany:latest_page_view"
                name="document_latest_page_view"/>
          <meta content={documentData.category} class="fb_og_meta" property="decompany:category"
                name="document_category"/>
          <meta content={documentData.tags} class="fb_og_meta" property="decompany:tags" name="document_tags"/>
        </Helmet>

        <div className="col-md-12 col-lg-8 view_left">
          <ContentViewFullScreen documentData={documentData} documentText={documentText} drizzleApis={drizzleApis}
                                 auth={auth} author={author} />
        </div>

        <div className="col-md-12 col-lg-4 ">
          <ContentViewRight documentData={documentData} author={author} featuredList={featuredList} {...rest}/>
        </div>
      </div>

    );
  }
}

export default ContentView;
