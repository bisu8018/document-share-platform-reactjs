import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { NavigateBefore, NavigateNext, Face } from "@material-ui/icons";
import { Link } from 'react-router-dom';
import Button from "components/CustomButtons/Button.jsx";
import Badge from "components/Badge/Badge.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.jsx";
import ContentVote from 'contents/ContentVote';
import ContentViewRegistBlockchainButton from 'contents/ContentViewRegistBlockchainButton';
import ContentViewRight from "contents/ContentViewRight"
import * as restapi from 'apis/DocApi';
import DrizzleApis from 'apis/DrizzleApis';
import Spinner from 'react-spinkit'

import AuthorEstimatedToday from "profile/AuthorEstimatedToday"
import AuthorRevenueOnDocument from "profile/AuthorRevenueOnDocument"
import ContentViewComment from "./ContentViewComment"
import ContentViewFullScreen from "./ContentViewFullScreen";

import FileDownload from "js-file-download";


const style = {

};

class ContentView extends React.Component {

  state = {
    document:null,
    documentText:null,
    dataKey:null,
    determineAuthorToken:-1,
    isExistInBlockChain: false,
    list: null,
  }

  getContentInfo = (documentId) => {
    restapi.getDocument(documentId).then((res) => {
      console.log(res.data);
      this.setState({document:res.data.document, list:res.data.list});
      //this.handleDetermineAuthorToken();
    });

    restapi.getDocumentText(documentId).then((res) => {
      //console.log(res);
      this.setState({documentText:res.data.text});
    });

  }

  getContentDownload = (accountId, documentId, documentName) => {


    restapi.getContentDownload(accountId, documentId).then((res) => {
      console.log(res);
      /*
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      */

      FileDownload(new Blob([res.data]), documentName);


    }).catch((err) => {
      console.error(err);
    });

  }

  handleDownloadContent = () => {

    if(!this.state.document){
      console.log("getting document meta infomation!");
      return;
    }
    console.log(this.state.document);
    const accountId = this.state.document.accountId;
    const documentId = this.state.document.documentId;
    const documentName = this.state.document.documentName;

    this.getContentDownload(accountId, documentId, documentName);
  }

  handleDetermineAuthorToken = () => {

    const {drizzleApis} = this.props
    if(!this.state.document) return;

    const doc = this.state.document;

    if(!doc || !doc.documentId){
      console.error("handleDetermineAuthorToken documentId is nothing");
      return;
    }

    drizzleApis.determineAuthorToken(doc.documentId).then(function(data){
      if(data){
        this.setState({determineAuthorToken: data});
      }
    });

  }

  componentWillMount() {
    if(!this.state.document) {
      const { match} = this.props;
      const documentId = match.params.documentId;
      this.getContentInfo(documentId);

    }
  }

  render() {
    const { classes, drizzleApis } = this.props;

    const document = this.state.document;

    if(!document) {
      return (<div className="spinner"><Spinner name="ball-pulse-sync"/></div>);
    }

    return (
      <div className="contentGridView">
         <div className="leftWrap">
             <ContentViewFullScreen document={document} {...this.props}/>
             <h2 className="tit">{document.title?document.title:""}</h2>
             <div className="descript"
                   style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}>
              {restapi.convertTimestampToString(document.created)}
              </div>
             <div>
                 <Button color="rose" size="sm">Vote</Button>
                 <Button color="rose" size="sm">Share</Button>
                 <Button color="rose" size="sm" onClick={this.handleDownloadContent}>Download</Button>
                 <ContentViewRegistBlockchainButton document={document} {...this.props} />
             </div>
             <span>
                <Badge color="info">View {document.viewCount?document.viewCount:0 + document.confirmViewCount?document.confirmViewCount:0} </Badge>
                <AuthorRevenueOnDocument document={document} {...this.props} />
                <Badge color="success">Vote $ {drizzleApis.toDollar(document.totalVoteAmount?document.totalVoteAmount:"0")}</Badge>
                {
                  document.tags?document.tags.map((tag, index) => (
                    <Badge color="warning" key={index}>{tag}</Badge>
                  )):""
                }
             </span>
             <Link to={"/author/" + document.accountId} >
                  <div className="profileImg">
                     <span className="userImg">
                         <Face className={classes.icons} />
                     </span>
                     <strong className="userName">{document.nickname?document.nickname:document.accountId}
                         <span className="txt"></span>
                      </strong>
                 </div>
                 <div className="proFileDescript">{document.desc?document.desc:""}</div>
              </Link>
              <ContentViewComment/>
              <div className="documentText">
              {this.state.documentText?this.state.documentText:"No Text"}
              </div>
         </div>
         <ContentViewRight document={this.state.document} list={this.state.list} {...this.props}/>
      </div>

    );
  }
}

export default withStyles(style)(ContentView);
