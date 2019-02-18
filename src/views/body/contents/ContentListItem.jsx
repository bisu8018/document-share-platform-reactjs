import React from "react";
import {Link} from 'react-router-dom';

import * as restapi from 'apis/DocApi';
/*import DollarWithDeck from 'profile/DollarWithDeck';
import DeckInShort from 'profile/DeckInShort';*/

import withStyles from "@material-ui/core/styles/withStyles";
import Button from '@material-ui/core/Button';
import {Face} from "@material-ui/icons";

import Badge from "components/badge/Badge";
import DollarWithDeck from "../profile/DollarWithDeck";
import DeckInShort from "../profile/DeckInShort";

const style = {};

class ContentListItem extends React.Component {
    render() {
        const {classes, result, drizzleApis} = this.props;
        const badgeReward = drizzleApis.toEther(result.confirmAuthorReward);
        const badgeVote = drizzleApis.toEther(result.confirmVoteAmount);
        const badgeView = result.totalViewCount ? result.totalViewCount : 0;
        let imageUrl = restapi.getThumbnail(result.documentId, 1);

        if (result.documentName.lastIndexOf(".dotx") > 0 || result.documentName.lastIndexOf(".dot") > 0 || result.documentName.lastIndexOf(".docx") > 0) {
            imageUrl = restapi.getPageView(result.documentId, 1);
        }

        return (

            <div className="cardCont" key={result.documentId}>
                <Link to={"/content/view/" + result.documentId}>
                    <div className="img">
                        <span>
                            <img src={imageUrl} alt={result.title}/>
                        </span>
                    </div>
                </Link>

                <div className="inner">
                    <div className="profileImg">
                        <span className="userImg">
                            <Face className={classes.icons}/>
                        </span>
                        <span className="userName">
                            <Button className={classes.button}>
                               <Link
                                   to={"/author/" + result.accountId}>
                                   {result.nickname ? result.nickname : result.accountId}
                               </Link>
                            </Button>
                        </span>
                    </div>

                    <Link to={"/content/view/" + result.documentId}>
                        <div className="tit">
                            {result.title ? result.title : result.documentName}
                        </div>
                        <div className="descript">
                            {restapi.convertTimestampToString(result.created)}
                        </div>
                        <div className="descript">
                            {result.desc}
                        </div>
                    </Link>

                    <div className="badge">
                        <Badge color="info">View {badgeView} </Badge>
                        <Badge color="success">
                            Reward
                            <DollarWithDeck deck={badgeReward} drizzleApis={drizzleApis}/>
                        </Badge>
                        <Badge color="success">Vote <DeckInShort deck={badgeVote}/></Badge>
                        {result.tags ? result.tags.map((tag, index) => (
                            <Badge color="warning" key={index}>{tag}</Badge>
                        )) : ""}
                    </div>
                </div>

            </div>

        );
    }
}

export default withStyles(style)(ContentListItem);
