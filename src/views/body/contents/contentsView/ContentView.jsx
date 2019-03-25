import React from "react";
import Spinner from "react-spinkit";
import { Helmet } from "react-helmet";
import Web3Apis from "apis/Web3Apis";

import ContentViewFullScreen from "./ContentViewFullScreen";
import ContentViewRight from "./ContentViewRight";
import MainRepository from "../../../../redux/MainRepository";
import Common from "../../../../common/Common";


class ContentView extends React.Component {
  state = {
    documentTitle: null,
    documentData: null,
    documentText: null,
    determineAuthorToken: -1,
    featuredList: null,
    approved: -1
  };

  web3Apis = new Web3Apis();

  getContentInfo = (documentId) => {
    this.setState({documentTitle : documentId});
    MainRepository.Document.getDocument(documentId, (res) => {
      this.setState({
        documentTitle: res.document.seoTitle,
        documentData: res.document,
        featuredList: res.featuredList,
        documentText: res.text,
        determineAuthorToken: -1,
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

  componentWillMount() {
    if (!this.state.documentData) {
      const { match } = this.props;
      const documentId = match.params.documentId;
      this.getContentInfo(documentId);
    }
  }

  shouldComponentUpdate = () => {
    this.getApproved();
    return true;
  };


  componentDidUpdate = () => {
    const { match } = this.props;
    const oldDocumentId = this.state.documentTitle;
    const newDocumentId = match.params.documentId;
    if(newDocumentId !== oldDocumentId){
        this.getContentInfo(newDocumentId);
    }
  };

  render() {
    const { drizzleApis, auth, ...rest } = this.props;
    const documentData = this.state.documentData;
    if (!documentData) {
      return (<div className="spinner"><Spinner name="ball-pulse-sync"/></div>);
    }
    let imageUrl = Common.getThumbnail(documentData.documentId, 1);
    return (

      <div data-parallax="true" className="container_view row col-re">
            <Helmet>
              <meta charSet="utf-8"/>
              <title>{documentData.seoTitle}</title>
              <meta name="description" content={documentData.desc} />
              <meta name="thumbnail" content={imageUrl} />
              <link rel="canonical" href={"http://dev.share.decompany.io/doc/" + documentData.seoTitle}/>

              <meta content="2237550809844881" class="fb_og_meta" property="fb:app_id" name="fb_app_id" />
              <meta content="decompany:document" class="fb_og_meta" property="og:type" name="og_type" />
              <meta content={window.location.href} class="fb_og_meta" property="og:url" name="og_url" />
              <meta content={imageUrl} class="fb_og_meta" property="og:image" name="og_image" />
              <meta content={documentData.title} class="fb_og_meta" property="og:title" name="og_title" />
              <meta content={documentData.desc} class="fb_og_meta" property="og:description" name="og_description" />
              <meta content={Common.timestampToDateTime(documentData.created)} class="fb_og_meta" property="decompany:created_time" name="document_created_time" />
              <meta content={documentData.userName || documentData.accountId} class="fb_og_meta" property="decompany:author" name="document_created_time_author" />
              <meta content={documentData.viewCount} class="fb_og_meta" property="decompany:view_count" name="document_view_count" />
              <meta content={documentData.totalPages} class="fb_og_meta" property="decompany:total_pages" name="document_total_pages" />
              <meta content={documentData.latestPageView} class="fb_og_meta" property="decompany:latest_page_view" name="document_latest_page_view" />
              <meta content={documentData.category} class="fb_og_meta" property="decompany:category" name="document_category" />
              <meta content={documentData.tags} class="fb_og_meta" property="decompany:tags" name="document_tags" />
            </Helmet>

            <div className="col-md-12 col-lg-8 view_left">
              <ContentViewFullScreen documentData={documentData} documentText={this.state.documentText} drizzleApis={drizzleApis} auth={auth}/>
            </div>

            <div className="col-md-12 col-lg-4 ">
              <ContentViewRight documentData={documentData} featuredList={this.state.featuredList} {...rest}/>
            </div>
      </div>

    );
  }
}

export default ContentView;
