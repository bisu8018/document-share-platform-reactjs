import React from "react";
import Spinner from "react-spinkit";
import { Helmet } from "react-helmet";

import withStyles from "@material-ui/core/styles/withStyles";
import Web3Apis from "apis/Web3Apis";

import ContentViewFullScreen from "./ContentViewFullScreen";
import ContentViewRight from "./ContentViewRight";
import MainRepository from "../../../../redux/MainRepository";

const style = {};

class ContentView extends React.Component {
  state = {
    document: null,
    documentText: null,
    determineAuthorToken: -1,
    featuredList: null,
    approved: -1
  };

  web3Apis = new Web3Apis();

  getContentInfo = (documentId) => {
    MainRepository.Document.getDocument(documentId, (res) => {
      this.setState({ document: res.document, featuredList: res.featuredList  });
    });
  };

  getDocumentText = (documentId) => {
    MainRepository.Document.getDocumentText(documentId, (res) => {
      this.setState({ documentText: res.text  });

    });
  };

  getApproved = () => {
    const { drizzleApis } = this.props;
    if (drizzleApis.isAuthenticated() && this.state.approved < 0) {
      this.web3Apis.getApproved(drizzleApis.getLoggedInAccount()).then((data) => {
        this.setState({ approved: data });
      }).catch((err) => {
        console.log("getApproved Error", err);
      });
    }
  };

  componentWillMount() {
    if (!this.state.document) {
      const { match } = this.props;
      const documentId = match.params.documentId;
      this.getContentInfo(documentId);
      this.getDocumentText(documentId);
    }
  }

  shouldComponentUpdate() {
    this.getApproved();
    return true;
  }

  render() {
    const { ...rest } = this.props;
    const document = this.state.document;
    if (!document) {
      return (<div className="spinner"><Spinner name="ball-pulse-sync"/></div>);
    }
    return (

      <div data-parallax="true" className="container_view">
        <div className="container">
          <div className="row col-re">

            <Helmet>
              <meta charSet="utf-8"/>
              <title>{document.title}</title>
              <link rel="canonical" href={"http://dev.share.decompany.io/content/view/" + document.documentId}/>
            </Helmet>

            <div className="col-md-12 col-lg-8 view_left">
              <ContentViewFullScreen document={document} documentText={this.state.documentText} {...rest}/>
            </div>

            <div className="col-md-12 col-lg-4 ">
              <ContentViewRight document={document} featuredList={this.state.featuredList} {...rest}/>
            </div>

          </div>
        </div>
      </div>

    );
  }
}

export default withStyles(style)(ContentView);
