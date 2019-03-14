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
    documentData: null,
    documentText: null,
    determineAuthorToken: -1,
    featuredList: null,
    approved: -1
  };

  web3Apis = new Web3Apis();

  clearState = () => {
    this.setState({
      documentData: null,
      documentText: null,
      determineAuthorToken: -1,
      featuredList: null,
      approved: -1
    })
  };

  getContentInfo = (documentId) => {
    MainRepository.Document.getDocument(documentId, (res) => {
      this.setState({ documentData: res.document, featuredList: res.featuredList  });
    });
  };

  getDocumentText = (documentId) => {
    MainRepository.Document.getDocumentText(documentId, (res) => {
      this.setState({ documentText: res.text  });

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
      this.getDocumentText(documentId);
    }
  }

  shouldComponentUpdate = () => {
    this.getApproved();
    return true;
  };

  componentDidUpdate = () => {
    const { match } = this.props;
    const oldDocumentId = this.state.documentData ? this.state.documentData.documentId : null;
    if(oldDocumentId){
      const newDocumentId = match.params.documentId;
      if(newDocumentId !== oldDocumentId) {
        this.clearState();
        this.getContentInfo(newDocumentId);
        this.getDocumentText(newDocumentId);
      }
    }
  };

  render() {
    const { drizzleApis, auth, ...rest } = this.props;
    const documentData = this.state.documentData;
    if (!documentData) {
      return (<div className="spinner"><Spinner name="ball-pulse-sync"/></div>);
    }
    return (

      <div data-parallax="true" className="container_view">
        <div className="container">
          <div className="row col-re">

            <Helmet>
              <meta charSet="utf-8"/>
              <title>{documentData.title}</title>
              <link rel="canonical" href={"http://dev.share.decompany.io/content/view/" + documentData.documentId}/>
            </Helmet>

            <div className="col-md-12 col-lg-8 view_left">
              <ContentViewFullScreen documentData={documentData} documentText={this.state.documentText} drizzleApis={drizzleApis} auth={auth}/>
            </div>

            <div className="col-md-12 col-lg-4 ">
              <ContentViewRight documentData={documentData} featuredList={this.state.featuredList} {...rest}/>
            </div>

          </div>
        </div>
      </div>

    );
  }
}

export default withStyles(style)(ContentView);
