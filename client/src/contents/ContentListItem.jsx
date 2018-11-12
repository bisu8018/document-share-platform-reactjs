import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Badge from "components/Badge/Badge.jsx";
import Button from '@material-ui/core/Button';
import { Face } from "@material-ui/icons";
import { Link } from 'react-router-dom';
import * as restapi from 'apis/DocApi';
import DollarWithDeck from 'profile/DollarWithDeck';
import AuthorEstimatedToday from 'profile/AuthorEstimatedToday';
import DeckInShort from 'profile/DeckInShort';

const style = {

};

class ContentListItem extends React.Component {


    render() {
      const { classes, result, drizzleApis } = this.props;

      const badgeReward = drizzleApis.toEther(result.confirmAuthorReward);
      const badgeVote = drizzleApis.toEther(result.confirmVoteAmount);
      const badgeView = result.totalViewCount ? result.totalViewCount : 0;

      return (

         <div className="cardCont" key={result.documentId}>
             <Link to={"/content/view/" + result.documentId} >
               <div className="img"><span><img src={restapi.getThumbnail(result.documentId, 1)} alt={result.documentName?result.documentName:result.documentId} alt={result.documentName?result.documentName:result.documentId} /></span></div>
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
                     <Badge color="info">View {badgeView} </Badge>
                     {/*<AuthorRevenueOnDocument document={result} {...this.props} />*/}
                     <Badge color="success">Reward <DollarWithDeck deck={badgeReward} drizzleApis={drizzleApis} /></Badge>
                     <Badge color="success">Vote <DeckInShort deck={badgeVote} /></Badge>
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
