import React from "react";
import {Link} from 'react-router-dom';

import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import Button from "components/custom/HeaderButton";

const style = {};

const categories = [
    "Art & Photos", "Automotive", "Business", "Career", "Data & Analytics", "Design",
    "Devices & Hardware", "Economy & Finance", "Education", "Engineering", "Entertainment & Humor", "Environment", "Food",
    "Government & Nonprofit", "Health & Medicine", "Healthcare", "Engineering", "Internet", "Investor Relations", "Law",
    "Leadership & Management", "Lifestyle", "Marketing", "Mobile", "News & Politics", "Presentations & Public Speaking", "Real Estate",
    "Recruiting & HR", "Retail", "Sales", "Science", "Self Improvement", "Services", "Small Business & Entrepreneurship", "Social Media",
    "Software", "Spiritual", "Sports", "Technology", "Templates", "Travel"
];

class ContentTags extends React.Component {

    handleOnClick = (e) => {
        const {tagSearch, path} = this.props;
        const tag = e.target.text;
        window.scrollTo(0, 0);
        //console.log("handleOnClick", path, tag);

        tagSearch(tag, path);
    };

    render() {
        return (

            <div className="leftWrap">
                <List>
                    {
                        categories.map((category, idx) => {
                            return (

                                <ListItem key={idx}>
                                    <Button key={category} color="transparent">
                                        <Link to="#" onClick={this.handleOnClick}>{category}</Link>
                                    </Button>
                                </ListItem>

                            );
                        })
                    }
                </List>
            </div>

        );
    }
}

export default withStyles(style)(ContentTags);
