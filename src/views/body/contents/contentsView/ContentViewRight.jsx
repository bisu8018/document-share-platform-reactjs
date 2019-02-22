import React from "react";
import Spinner from 'react-spinkit';

import withStyles from "@material-ui/core/styles/withStyles";

import * as restapi from 'apis/DocApi';
import Badge from "components/badge/Badge";
import DeckInShort from "../../profile/DeckInShort"
import DollarWithDeck from "../../profile/DollarWithDeck"

const style = {};

class ContentViewRight extends React.Component {

    componentWillMount() {
    }

    render() {
        const {document, featuredList, drizzleApis} = this.props;

        if (!document) {
            return (<div className="spinner"><Spinner name="ball-pulse-sync"/></div>);
        }
        //let voteTag = null;
        //if(drizzleApis.isAuthenticated()){
        //  voteTag = (<ContentVote {...this.props} document={document}/>);
        //}

        //const badgeReward = drizzleApis.toEther(document.confirmAuthorReward);
        //const badgeVote = drizzleApis.toEther(document.confirmVoteAmount);
        //const badgeView = document.totalViewCount ? document.totalViewCount : 0;

        //const currentDocumentId = document.documentId;

        return (

            <div className="rightWrap">

                <h3>Sponsored link</h3>

                <div className="cardSide">
                  <span className="img">
                    <a href="https://www.polarisoffice.com" target='_blank'>
                        <img src={require('assets/image/temp/decompany_ad.png')} alt="AD PolarisOffice"/>
                    </a>
                  </span>
                </div>

                <h3>See also</h3>

                {featuredList.map((result, idx) => (
                    <div className="cardSide" key={result.documentId}>

                        <a href={"/content/view/" + result.documentId}>
                            <span className="img">
                                <img src={restapi.getThumbnail(result.documentId, 1)}
                                     alt={result.documentName ? result.documentName : result.documentId}
                                     alt={result.documentName ? result.documentName : result.documentId}/>
                            </span>
                        </a>

                        <div className="inner">
                            <div className="tit"
                                 style={{
                                     display: '-webkit-box',
                                     textOverflow: 'ellipsis',
                                     'WebkitBoxOrient': 'vertical'
                                 }}>
                                {result.title}
                            </div>
                            <div className="descript"
                                 style={{
                                     display: '-webkit-box',
                                     textOverflow: 'ellipsis',
                                     'WebkitBoxOrient': 'vertical'
                                 }}>
                                {restapi.convertTimestampToString(result.created)}
                            </div>
                            <div className="descript"
                                 style={{
                                     display: '-webkit-box',
                                     textOverflow: 'ellipsis',
                                     'WebkitBoxOrient': 'vertical'
                                 }}
                            >
                                {result.desc}
                            </div>
                            <div className="badge">
                                <Badge
                                    color="info">View {isNaN(result.totalViewCount) ? 0 : result.totalViewCount} </Badge>
                                <Badge color="success">Reward <DollarWithDeck
                                    deck={drizzleApis.toEther(result.confirmAuthorReward)}
                                    drizzleApis={drizzleApis}/></Badge>
                                <Badge color="success">Vote <DeckInShort
                                    deck={drizzleApis.toEther(result.confirmVoteAmount)}/></Badge>
                                {result.tags ? result.tags.map((tag, index) => (
                                    <Badge color="warning" key={index}>{tag}</Badge>
                                )) : ""}
                            </div>
                        </div>

                    </div>
                ))}

            </div>

        );
    }
}

export default withStyles(style)(ContentViewRight);
