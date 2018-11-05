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
import * as restapi from 'apis/DocApi';
import DrizzleApis from 'apis/DrizzleApis';
import Spinner from 'react-spinkit';

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
    isExistInBlockChain: false
  }

  getContentInfo = (documentId) => {
    restapi.getDocument(documentId).then((res) => {
      console.log(res.data.document);
      this.setState({document:res.data.document});
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
    let voteTag = null;
    if(drizzleApis.isAuthenticated()){
      voteTag = (<ContentVote {...this.props} document={this.state.document}/>);
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

               <div>
                   <Button color="rose" size="sm">Like</Button>
                   <Button color="rose" size="sm">Share</Button>
                   <Button color="rose" size="sm">Download</Button>
                   <ContentViewRegistBlockchainButton document={document} {...this.props} />
               </div>
               <span>
                  <Badge color="info">View {document.viewCount?document.viewCount:0 + document.confirmViewCount?document.confirmViewCount:0} </Badge>
                  <Badge color="success">Reward <AuthorRevenueOnDocument document={document} {...this.props} /></Badge>
                  <Badge color="success">Vote $ {drizzleApis.toDollar(document.totalVoteAmount?document.totalVoteAmount:"0")}</Badge>
               </span>
               <Link to={"/author/" + document.accountId} >

                    <div className="profileImg">
                       <span className="userImg">
                           <Face className={classes.icons} />
                           <img src="http://i.imgur.com/UGzF2lv.jpg" alt={document.accountId}/>
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


           <div className="rightWrap">
             {voteTag}
             {/*<ContentVote {...this.props} document={this.state.document}/>*/}


               <h3>See also</h3>
               <div className="cardSide">
                   <a href="#">
                       <span className="img">
                           <img src="https://cdn.namuwikiusercontent.com/s/c57155e34a23c4f9918e0e6e5f14924223aa3f15c78049539ee0ed4edd00eb00a429933b1228c370105dc861e72b0a79160ba74677b9f6f7a94c303cbdadf04482c375c5defbfa244dcbcb3a42d55e73?e=1546994084&k=W8a-YTwBcvw2CetlHaNR3A" alt=""/>
                       </span>
                      <div className="inner">
                           <div className="tit"
                               style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                               >25 Uses for Duct Tape on Your Next Camping Trip</div>
                           <div className="descript"
                               style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                            >Recommand Document</div>
                           <div className="badge">
                               <Badge color="rose">1,222 Deck</Badge>
                               <Badge color="rose">1,222 view</Badge>
                           </div>
                       </div>
                   </a>
               </div>

               <div className="cardSide">
                   <a href="#">
                       <span className="img">
                           <img src="https://dispatch.cdnser.be/wp-content/uploads/2017/01/20170105232912_lhj_1778.jpg" alt=""/>
                       </span>
                      <div className="inner">
                           <div className="tit"
                               style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                               >25 Uses for Duct Tape on Your Next Camping Trip</div>
                           <div className="descript"
                               style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                            >Recommand Document</div>
                           <div className="badge">
                               <Badge color="rose">1,222 Deck</Badge>
                               <Badge color="rose">1,222 view</Badge>
                           </div>
                       </div>
                   </a>
               </div>

           </div>


        </div>
    );
  }
}

export default withStyles(style)(ContentView);
