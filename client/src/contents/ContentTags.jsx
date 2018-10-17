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
import * as restapi from 'apis/DocApi';
import ContentListItem from 'contents/ContentListItem';
const style = {

};

class ContentTags extends React.Component {


    render() {
      const { classes, noTags } = this.props;

      return (

         <div className="leftWrap">
              <List>
                <ListItem><Button color="transparent">TECH</Button></ListItem>
                <ListItem><Button color="transparent">BLOCKCAHIN</Button></ListItem>
                <ListItem><Button color="transparent">MUSIC</Button></ListItem>
                <ListItem><Button color="transparent">PDF</Button></ListItem>
              </List>
         </div>

      );
    }
}

export default withStyles(style)(ContentTags);
