import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { NavigateBefore, NavigateNext, Face } from "@material-ui/icons";
import { Link } from 'react-router-dom';
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Badge from "components/Badge/Badge.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
//import ContentVote from 'contents/ContentVote';
import ContentViewRegistBlockchainButton from 'contents/ContentViewRegistBlockchainButton';
import * as restapi from 'apis/DocApi';
import DrizzleApis from 'apis/DrizzleApis';
import Spinner from 'react-spinkit';
import adimg from 'assets/img/decompany_ad.png';

import AuthorEstimatedToday from "profile/AuthorEstimatedToday"
import AuthorRevenueOnDocument from "profile/AuthorRevenueOnDocument"
const style = {

};

class ContentViewRight extends React.Component {

  componentWillMount() {

  }

  render() {
    const { classes, document, list, drizzleApis } = this.props;

    if(!document) {
      return (<div className="spinner"><Spinner name="ball-pulse-sync"/></div>);
    }
    //let voteTag = null;
    //if(drizzleApis.isAuthenticated()){
    //  voteTag = (<ContentVote {...this.props} document={document}/>);
    //}

    return (

      <div className="rightWrap">
           <h3>Sponsored link</h3>
           <div className="cardSide">
               <span className="img">
                 <a href="https://www.polarisoffice.com" target='_blank'>
                 <img src={adimg} alt="AD PolarisOffice" />
                 </a>
               </span>
            </div>
           <h3>See also</h3>
           {list.map((result, idx) => (
             <div className="cardSide" key={result.documentId}>
               <Link to={"/content/view/" + result.documentId} >
                   <span className="img">
                       <img src={restapi.getThumbnail(result.documentId, 1)} alt={result.documentName?result.documentName:result.documentId} alt={result.documentName?result.documentName:result.documentId} />
                   </span>
               </Link>
               <div className="inner">
                   <div className="tit"
                       style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                       >{result.title}</div>
                       <div className="descript"
                           style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}>
                      {restapi.convertTimestampToString(result.created)}
                      </div>
                   <div className="descript"
                       style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                    >
                    {result.desc}
                    </div>
                   <div className="badge">
                     <Badge color="info">View {result.totalViewCount?result.totalViewCount:0} </Badge>
                     <AuthorRevenueOnDocument document={result} {...this.props} />
                     <Badge color="success">Vote $ {drizzleApis.toDollar(result.confirmVoteAmount?result.confirmVoteAmount:"0")}</Badge>
                     {result.tags?result.tags.map((tag, index) => (
                       <Badge color="warning" key={index}>{tag}</Badge>
                     )):""}
                   </div>
               </div>
            </div>

          ))}
       </div>

    );
  }
}

export default withStyles(style)(ContentViewRight);
