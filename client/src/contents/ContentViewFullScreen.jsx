import React, { Component } from "react";
import Fullscreen from "react-full-screen";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/CustomButtons/Button.jsx";
import * as restapi from 'apis/DocApi';
import ContentViewCarousel from './ContentViewCarousel';
import AuthorRevenueOnDocument from "profile/AuthorRevenueOnDocument"
import ContentViewComment from "./ContentViewComment"
import VoteOnDocument from "./VoteOnDocument";
import ContentViewRegistBlockchainButton from 'contents/ContentViewRegistBlockchainButton';
import Badge from "components/Badge/Badge.jsx";
import FileDownload from "js-file-download";
import DrizzleApis from 'apis/DrizzleApis';
import { NavigateBefore, NavigateNext, Face } from "@material-ui/icons";
import { Link } from 'react-router-dom';

const style = {
  pageViewer: {
    position: "relative",
    height: "auto"
  },
  fullViewer: {
    position: "absolute",
    width: "auto",
    height: "100vh",
    display: "none"
  },
  fullscreenBar: {
    textAlign: "right",
    float:"right"
  },
  fullscreenBtn: {
    padding:"5px",
    margin:"5px",
    fontSize:"12px"
  }
}

class ContentViewFullScreen extends Component {

  state = {
    documentText:null,
    isExistInBlockChain: false,
  }

  constructor(props) {
    super();

    const { document, classes, drizzleApis } = props;
    this.document = document;
    //this.goNormal = goNormal;
    this.classes = classes;
    this.drizzleApis = drizzleApis;
    this.state = {
      isFull:false
    };
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

    if(!this.document){
      console.log("getting document meta infomation!");
      return;
    }
    console.log(this.document);
    const accountId = this.document.accountId;
    const documentId = this.document.documentId;
    const documentName = this.document.documentName;

    this.getContentDownload(accountId, documentId, documentName);
  }

  goFull = () => {
    this.setState({ isFull: true });
  }

  render() {

    const { classes, ...other } = this.props;

    let page = document.getElementById("page");
    let full = document.getElementById("full");

    if (page !== null) {
      if (this.state.isFull) {
        page.style.display = "none";
      } else {
        page.style.display = "block";
      }
    }

    if (full !== null) {
      if (this.state.isFull) {
        full.style.display = "block";
      } else {
        full.style.display = "none";
      }
    }

    return (

      <div className="ContentViewFullScreen">
        <Fullscreen
          enabled={this.state.isFull}
          onChange={isFull => this.setState({isFull})}
        >
          <div id="page" className={this.classes.pageViewer}>
            <ContentViewCarousel target={this.document} state={this.state} />
            <div className={this.classes.fullscreenBar}>
              <Button className={this.classes.fullscreenBtn} onClick={this.goFull}>View full screen</Button>
            </div>
            <h2 className="tit">{this.document.title?this.document.title:""}</h2>
            <div className="descript"
                  style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}>
             {restapi.convertTimestampToString(this.document.created)}
             </div>
            <div>
                <VoteOnDocument document={this.document} {...other} />
                <Button color="rose" size="sm">Share</Button>
                <Button color="rose" size="sm" onClick={this.handleDownloadContent}>Download</Button>
                <ContentViewRegistBlockchainButton document={this.document} {...other} />
            </div>
            <span>
               <Badge color="info">View {this.document.viewCount?this.document.viewCount:0 + this.document.confirmViewCount?this.document.confirmViewCount:0} </Badge>
               <AuthorRevenueOnDocument document={document} {...other} />
               <Badge color="success">Vote $ {this.drizzleApis.toDollar(this.document.totalVoteAmount?this.document.totalVoteAmount:"0")}</Badge>
               {
                 this.document.tags?this.document.tags.map((tag, index) => (
                   <Badge color="warning" key={index}>{tag}</Badge>
                 )):""
               }
            </span>
            <Link to={"/author/" + this.document.accountId} >
                 <div className="profileImg">
                    <span className="userImg">
                        <Face className={classes.icons} />
                    </span>
                    <strong className="userName">{this.document.nickname?this.document.nickname:this.document.accountId}
                        <span className="txt"></span>
                     </strong>
                </div>
                <div className="proFileDescript">{this.document.desc?this.document.desc:""}</div>
             </Link>
             <ContentViewComment/>
             <div className="documentText">
             {this.state.documentText?this.state.documentText:"No Text"}
             </div>
          </div>
          <div id="full" className={this.classes.fullViewer}>
            <ContentViewCarousel target={this.document} state={this.state} {...other}/>
          </div>
        </Fullscreen>
      </div>
    );
  }
}

export default withStyles(style)(ContentViewFullScreen);
