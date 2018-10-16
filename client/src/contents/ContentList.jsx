import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/CustomButtons/Button.jsx";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Badge from "components/Badge/Badge.jsx";
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from 'react-spinkit';
import { Face } from "@material-ui/icons";
import { Link } from 'react-router-dom';

const style = {

};

const domain = "https://24gvmjxwme.execute-api.us-west-1.amazonaws.com";

class ContentList extends React.Component {
    state = {
      items: Array.from({ length: 10 })
    };

    fetchMoreData = () => {
        setTimeout(() => {
          this.setState({
            items: this.state.items.concat(Array.from({ length: 20 }))
          });
        }, 1500);
    };

    imageUrl = (documentId, pageNo) => domain+ "/prod/document/thumb/" + documentId + "/" + pageNo;

    goDetail = (e) => {
      //e.preventDefault();
      //console.log("goDetail", e);
      this.props.handleSelectDocument(e);

    }



    render() {
      const { classes, resultList } = this.props;
      return (
          <div>
             <InfiniteScroll
               dataLength={resultList.length}
               next={this.fetchMoreData}
               hasMore={true}
               loader={<div className="spinner"><Spinner name="ball-pulse-sync"/></div>}
             >

                 <div className="contentGrid">
                    <div className="leftWrap">
                        <List>
                          <ListItem><Button color="transparent">TECH</Button></ListItem>
                          <ListItem><Button color="transparent">BLOCKCAHIN</Button></ListItem>
                          <ListItem><Button color="transparent">MUSIC</Button></ListItem>
                          <ListItem><Button color="transparent">PDF</Button></ListItem>
                        </List>
                   </div>

                    <div className="rightWrap">
                        <h3>#TECH</h3>
                        {resultList.map((result, index) => (
                         <div className="cardCont" key={result.documentId}>
                             <Link to={"/content/view/" + result.documentId} >
                               <div className="img"><span><img src={this.imageUrl(result.documentId, 1)} alt={result.documentName?result.documentName:result.documentId} alt={result.documentName?result.documentName:result.documentId} /></span></div>
                             </Link>
                             <div className="inner">
                                 <Link to={"/author/" + document.accountId} >
                                     <div className="profileImg">
                                         <span className="userImg">
                                             <Face className={classes.icons} />
                                             <img src={this.imageUrl(result.documentId, 1)} alt={result.accountId} />
                                         </span>
                                         <strong className="userName">{result.accountId}</strong>
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
                                         <Badge color="info">Vote 123,000</Badge>
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
                       ))}
                     </div>
                </div>
             </InfiniteScroll>
          </div>
      );
    }
}

export default withStyles(style)(ContentList);
