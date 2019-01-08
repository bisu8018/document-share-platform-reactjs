import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { NavigateBefore, NavigateNext, Face } from "@material-ui/icons";
import { Link } from 'react-router-dom';
import Button from "components/CustomButtons/Button.jsx";
import Badge from "components/Badge/Badge.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.jsx";
//import ContentVote from 'contents/ContentVote';
import ContentViewRight from "contents/ContentViewRight"
import * as restapi from 'apis/DocApi';
import DrizzleApis from 'apis/DrizzleApis';
import Web3Apis from 'apis/Web3Apis';
import Spinner from 'react-spinkit'
import {Helmet} from "react-helmet";

import AuthorEstimatedToday from "profile/AuthorEstimatedToday"
import ContentViewFullScreen from "./ContentViewFullScreen";

const style = {

};

class ContentView extends React.Component {

  state = {
    document:null,
    documentText:null,
    dataKey:null,
    determineAuthorToken:-1,
    featuredList: null,
    approved: -1
  }

  web3Apis = new Web3Apis();

  getContentInfo = (documentId) => {
    restapi.getDocument(documentId).then((res) => {
      console.log(res.data);
      this.setState({document: res.data.document, featuredList: res.data.featuredList});

    });

    restapi.getDocumentText(documentId).then((res) => {
      //console.log("text ", res);
      this.setState({documentText: res.data.text});
    });

  }

  getApproved = () => {
    const { drizzleApis } = this.props;

    if(drizzleApis.isAuthenticated() && this.state.approved < 0){

      this.web3Apis.getApproved(drizzleApis.getLoggedInAccount()).then((data) => {
        console.log("getApproved", data);
        this.setState({approved: data});
      }).catch((err) => {
        console.log("getApproved Error", err);
      });
    }

  }

  componentWillMount() {
    if(!this.state.document) {
      const { match } = this.props;
      const documentId = match.params.documentId;
      this.getContentInfo(documentId);

      console.log(documentId, "byte32", this.web3Apis.asciiToHex(documentId));
    }
  }

  shouldComponentUpdate(){
    this.getApproved();
    return true;
  }

  render() {
    const { classes, ...others } = this.props;
    const document = this.state.document;

    if(!document) {
      return (<div className="spinner"><Spinner name="ball-pulse-sync"/></div>);
    }

    return (

      <div className="contentGridView application">

        <Helmet>
            <meta charSet="utf-8" />
            <title>{document.title}</title>
            <link rel="canonical" href={"http://share.decompany.io/content/view/" + document.documentId} />
        </Helmet>
         <div className="leftWrap">
            <ContentViewFullScreen document={document} documentText={this.state.documentText} {...others}/>
          </div>
         <ContentViewRight document={this.state.document} featuredList={this.state.featuredList} {...others}/>
      </div>

    );
  }
}

export default withStyles(style)(ContentView);
