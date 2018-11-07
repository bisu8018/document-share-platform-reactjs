import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Badge from "components/Badge/Badge.jsx";
import { Face } from "@material-ui/icons";
import { Link } from 'react-router-dom';
import * as restapi from 'apis/DocApi';
import AuthorRevenueOnDocument from 'profile/AuthorRevenueOnDocument';
import AuthorEstimatedToday from 'profile/AuthorEstimatedToday';

const style = {

};

class ContentListItem extends React.Component {


    render() {
      const { classes, result, drizzleApis } = this.props;

      return (

         <div className="cardCont" key={result.documentId}>
             <Link to={"/content/view/" + result.documentId} >
               <div className="img"><span><img src={restapi.getThumbnail(result.documentId, 1)} alt={result.documentName?result.documentName:result.documentId} alt={result.documentName?result.documentName:result.documentId} /></span></div>
             </Link>
             <div className="inner">
                 <Link to={"/author/" + result.accountId} >
                     <div className="profileImg">
                         <span className="userImg">
                             <Face className={classes.icons} />

                         </span>
                         <strong className="userName">{result.nickname?result.nickname:result.accountId}</strong>
                     </div>
                 </Link>
                 <Link to={"/content/view/" + result.documentId} >
                     <div className="tit"
                          style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                      >{result.title?result.title:result.documentName}</div>
                      <div className="descript"
                          style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}>
                     {restapi.convertTimestampToString(result.created)}
                     </div>
                     <div className="descript"
                         style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                      >{result.desc}</div>
                 </Link>
                 <div className="badge">
                     <Badge color="info">View {result.totalViewCount?result.totalViewCount:0} </Badge>
                     <AuthorRevenueOnDocument document={result} {...this.props} />
                     <Badge color="success">Vote $ {drizzleApis.toDollar(result.voteAmount)}</Badge>
                     {result.tags?result.tags.map((tag, index) => (
                     <Badge color="warning" key={index}>{tag}</Badge>
                       )):""}
                     {/*
                     <Badge color="success">success</Badge>
                     <Badge color="warning">warning</Badge>
                     <Badge color="danger">danger</Badge>
                     <Badge color="rose">rose</Badge>
                     */}
                 </div>
             </div>
         </div>


      );
    }
}

export default withStyles(style)(ContentListItem);
