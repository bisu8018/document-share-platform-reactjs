import React, { Component } from "react";
import Fullscreen from "react-full-screen";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/CustomButtons/Button.jsx";
import * as restapi from 'apis/DocApi';
import ContentViewCarousel from './ContentViewCarousel';
import DeckInShort from "profile/DeckInShort"
import DollarWithDeck from "profile/DollarWithDeck"
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
  },
  button: {
    boxShadow:"none"
  }
}

class ContentViewFullScreen extends Component {

  state = {
    isFull: false,
    currentPage: 0,
    totalPages: 0
  }

  handlePage = (page) => {
    if (this.state.totalPages > 0 && !this.state.isFull) {
      this.setState({currentPage:page});
    }
  }

  handleFull = (page) => {
    if (this.state.totalPages > 0 && this.state.isFull) {
      this.setState({currentPage:page});
    }
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

    if(!this.props.document){
      console.log("getting document meta infomation!");
      return;
    }
    //console.log(this.props.document);
    const accountId = this.props.document.accountId;
    const documentId = this.props.document.documentId;
    const documentName = this.props.document.documentName;

    this.getContentDownload(accountId, documentId, documentName);
  }

  goFull = () => {
    this.setState({ isFull: true });
  }

  render() {

    const { classes, ...other } = this.props;

    if (this.state.totalPages != this.props.document.totalPages) {
      this.setState({totalPages: this.props.document.totalPages});
    }

    let page = document.getElementById("page");
    if (page !== null) {
      if (this.state.isFull) {
        page.style.display = "none";
      } else {
        page.style.display = "block";
      }
    }

    let full = document.getElementById("full");
    if (full !== null) {
      if (this.state.isFull) {
        full.style.display = "block";
      } else {
        full.style.display = "none";
      }
    }

    const badgeReward = this.props.drizzleApis.toEther(this.props.document.confirmAuthorReward);
    const badgeVote = this.props.drizzleApis.toEther(this.props.document.confirmVoteAmount);
    const badgeView = this.props.document.totalViewCount ? this.props.document.totalViewCount : 0;

    return (

      <div className="ContentViewFullScreen">
        <Fullscreen
          enabled={this.state.isFull}
          onChange={isFull => this.setState({isFull})}
        >
          <div id="page" className={classes.pageViewer}>
            <ContentViewCarousel id="pageCarousel" target={this.props.document} onChange={this.handlePage} page={this.state.currentPage} {...other}/>
            <div className={classes.fullscreenBar}>
              <Button className={classes.fullscreenBtn} onClick={this.goFull}>View full screen</Button>
            </div>
            <h2 className="tit">{this.props.document.title?this.props.document.title:""}</h2>
            <div className="descript"
                  style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}>
             {restapi.convertTimestampToString(this.props.document.created)}
             </div>
            <div>
                <VoteOnDocument document={this.props.document} {...other} />
                <Button color="rose" size="sm">Share</Button>
                <Button color="rose" size="sm" onClick={this.handleDownloadContent}>Download</Button>
                <ContentViewRegistBlockchainButton document={this.props.document} {...other} />
            </div>
            <span>
               <Badge color="info">View {badgeView} </Badge>
               <Badge color="success">Reward <DollarWithDeck deck={badgeReward} drizzleApis={this.props.drizzleApis} /></Badge>
               <Badge color="success">Vote <DeckInShort deck={badgeVote} /></Badge>
               {
                 this.props.document.tags?this.props.document.tags.map((tag, index) => (
                   <Badge color="warning" key={index}>{tag}</Badge>
                 )):""
               }
            </span>
            <div className="profileImg">
                <span className="userImg">
                    <Face className={classes.icons} />
                </span>
                <span className="userName">
                  <Button className={classes.button}><Link to={"/author/" + this.props.document.accountId} >{this.props.document.nickname?this.props.document.nickname:this.props.document.accountId}</Link></Button>
                </span>
            </div>
            <div className="proFileDescript">{this.props.document.desc?this.props.document.desc:""}</div>
             <ContentViewComment/>
             <div className="documentText">
               {this.props.documentText?this.props.documentText:"No Text"}
             </div>
          </div>
          <div id="full" className={classes.fullViewer}>
            <ContentViewCarousel id="fullCarousel" target={this.props.document} onChange={this.handleFull} page={this.state.currentPage} {...other}/>
          </div>
        </Fullscreen>
      </div>
    );
  }
}

export default withStyles(style)(ContentViewFullScreen);
