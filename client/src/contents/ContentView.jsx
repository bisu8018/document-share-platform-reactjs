import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { NavigateBefore, NavigateNext, Face } from "@material-ui/icons";
import { Link } from 'react-router-dom';
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Badge from "components/Badge/Badge.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import ContentVote from 'contents/ContentVote';
import ContentViewRegistBlockchainButton from 'contents/ContentViewRegistBlockchainButton';
import ContentViewRight from "contents/ContentViewRight"
import * as restapi from 'apis/DocApi';
import DrizzleApis from 'apis/DrizzleApis';
import Spinner from 'react-spinkit'

import AuthorEstimatedToday from "profile/AuthorEstimatedToday"
import AuthorRevenueOnDocument from "profile/AuthorRevenueOnDocument"

const style = {

};

class ContentView extends React.Component {

  state = {
    document:null,
    documentText:null,
    currentPageNo:1,
    dataKey:null,
    determineAuthorToken:-1,
    isExistInBlockChain: false,
    list: null
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

  goNextPage = () => {
    let newPageNo = this.state.currentPageNo + 1;
    if(newPageNo>document.totalPages){
      newPageNo = document.totalPages;
    }

    this.setState({currentPageNo: newPageNo})
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

  goPrevPage = () => {
    let newPageNo = this.state.currentPageNo - 1;
    if(newPageNo<1){
      newPageNo = 1;
    }
    this.setState({currentPageNo: newPageNo})
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
               <div className="slideShow">
                   <div className="img"><img src={restapi.getPageView(document.documentId, this.state.currentPageNo)} alt=""/></div>
                   <CustomLinearProgress
                    variant="determinate"
                    color="gray"
                    value={(this.state.currentPageNo/document.totalPages) * 100}
                    style={{ width: "100%", height:'3px', display: "block" ,marginBottom: "0"}}
                  />
                    <div className="slideBtn">
                       <Button color="transparent" className="prev" onClick={this.goPrevPage}><NavigateBefore className={classes.icons} /> <span>Prev</span></Button>
                       <span>{this.state.currentPageNo} / {document.totalPages}</span>
                       <Button color="transparent" className="next" onClick={this.goNextPage}><span>Next</span> <NavigateNext className={classes.icons} /></Button>
                   </div>
               </div>


               <h2 className="tit">{document.title?document.title:""}</h2>
               <div className="descript"
                     style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}>
                {restapi.convertTimestampToString(document.created)}
                </div>
               <div>
                   <Button color="rose" size="sm">Like</Button>
                   <Button color="rose" size="sm">Share</Button>
                   <Button color="rose" size="sm">Download</Button>
                   <ContentViewRegistBlockchainButton document={document} {...this.props} />
               </div>
               <span>
                  <Badge color="info">View {document.viewCount?document.viewCount:0 + document.confirmViewCount?document.confirmViewCount:0} </Badge>
                  <AuthorRevenueOnDocument document={document} {...this.props} />
                  <Badge color="success">Vote $ {drizzleApis.toDollar(document.totalVoteAmount?document.totalVoteAmount:"0")}</Badge>
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
                <h3 className="tit02">Document Information</h3>
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
