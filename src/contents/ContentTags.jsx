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

const categories = [
  "Art & Photos", "Automotive", "Business", "Career", "Data & Analytics", "Design",
  "Devices & Hardware", "Economy & Finance", "Education", "Engineering", "Entertainment & Humor", "Environment", "Food",
  "Government & Nonprofit", "Health & Medicine", "Healthcare", "Engineering", "Internet", "Investor Relations", "Law",
  "Leadership & Management", "Lifestyle", "Marketing", "Mobile", "News & Politics", "Presentations & Public Speaking", "Real Estate",
  "Recruiting & HR", "Retail", "Sales", "Science", "Self Improvement", "Services", "Small Business & Entrepreneurship", "Social Media",
  "Software", "Spiritual", "Sports", "Technology", "Templates", "Travel"
]

class ContentTags extends React.Component {

  handleOnClick = (e) => {
    const { classes, tagSearch, path, url } = this.props;
    const tag = e.target.text;
    window.scrollTo(0, 0);
    console.log("handleOnClick", path, url, tag);

    tagSearch(tag, path);
  }

  handleToLink = (category) => {
    const { url } = this.props;

    const link = url.replace(":tag", category);
    //console.log("handleToLink", category, link);
    return link;
  }

  render() {
    const { classes, noTags , path} = this.props;

    return (

       <div className="leftWrap">
         <List>
           {
             categories.map((category, idx) => {
               return (<ListItem key={idx}><Button key={category} color="transparent" ><Link to="#" onClick={this.handleOnClick}>{category}</Link></Button></ListItem>);
             })
           }

         </List>
       </div>

    );
  }
}

export default withStyles(style)(ContentTags);
