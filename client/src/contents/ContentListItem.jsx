import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Badge from "components/Badge/Badge.jsx";
import Button from '@material-ui/core/Button';
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
      let imageUrl = restapi.getThumbnail(result.documentId, 1);
      if(result.documentName.lastIndexOf(".dotx")>0 || result.documentName.lastIndexOf(".dot")>0 || result.documentName.lastIndexOf(".docx")>0){
        imageUrl = restapi.getPageView(result.documentId, 1);
      }
      return (

         <div className="cardCont" key={result.documentId}>
             <Link to={"/content/view/" + result.documentId} >
               <div className="img"><span><img src={imageUrl} alt={result.title} /></span></div>
             </Link>
             <div className="inner">
                 <div className="profileImg">
                     <span className="userImg">
                         <Face className={classes.icons} />
                     </span>
                     <span className="userName">
                       <Button className={classes.button}><Link to={"/author/" + result.accountId} >{result.nickname?result.nickname:result.accountId}</Link></Button>
                     </span>
                 </div>
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
                     {/*<AuthorRevenueOnDocument document={result} {...this.props} />*/}
                     <Badge color="success">Reward $ {drizzleApis.toDollar(result.confirmAuthorReward)}</Badge>
                     <Badge color="success">Vote $ {drizzleApis.toDollar(result.confirmVoteAmount)}</Badge>
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
