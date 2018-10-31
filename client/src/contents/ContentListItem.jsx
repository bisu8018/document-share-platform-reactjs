import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Badge from "components/Badge/Badge.jsx";
import { Face } from "@material-ui/icons";
import { Link } from 'react-router-dom';
import * as restapi from 'apis/DocApi';
const style = {

};

class ContentListItem extends React.Component {


    render() {
      const { classes, result } = this.props;

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
                             <img src={restapi.getThumbnail(result.documentId, 1)} alt={result.accountId} />
                         </span>
                         <strong className="userName">{result.nickname?result.nickname:result.accountId}</strong>
                     </div>
                 </Link>
                 <Link to={"/content/view/" + result.documentId} >
                     <div className="tit"
                          style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                      >{result.title?result.title:result.documentName}</div>
                     <div className="descript"
                         style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                      >{result.desc}</div>
                     <div className="badge">
                         <Badge color="rose">DECK 1,222</Badge>
                         <Badge color="info">View {result.viewCount?result.viewCount:0 + result.confirmViewCount?result.confirmViewCount:0} </Badge>
                         {result.tags?result.tags.map((tag, index) => (
                               <Badge color="success" key={index}>{tag}</Badge>
                         )):""}
                         {/*
                         <Badge color="success">success</Badge>
                         <Badge color="warning">warning</Badge>
                         <Badge color="danger">danger</Badge>
                         <Badge color="rose">rose</Badge>
                         */}
                     </div>
                 </Link>
             </div>
         </div>


      );
    }
}

export default withStyles(style)(ContentListItem);
