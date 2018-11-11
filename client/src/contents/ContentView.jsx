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
import Spinner from 'react-spinkit'

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
    list: null,
  }

  getContentInfo = (documentId) => {
    restapi.getDocument(documentId).then((res) => {
      console.log(res.data);
      this.setState({document:res.data.document, list:res.data.list});

    });

    restapi.getDocumentText(documentId).then((res) => {
      console.log("text ", res);
      this.setState({documentText:res.data.text});
    });

  }

  componentWillMount() {
    if(!this.state.document) {
      const { match } = this.props;
      const documentId = match.params.documentId;
      this.getContentInfo(documentId);
    }
  }

  render() {
    const { classes, ...others } = this.props;
    const document = this.state.document;

    if(!document) {
      return (<div className="spinner"><Spinner name="ball-pulse-sync"/></div>);
    }

    return (
      <div className="contentGridView">
         <div className="leftWrap">
            <ContentViewFullScreen document={document} documentText={this.state.documentText} {...others}/>
         </div>
         <ContentViewRight document={this.state.document} list={this.state.list} {...others}/>
      </div>

    );
  }
}

export default withStyles(style)(ContentView);
