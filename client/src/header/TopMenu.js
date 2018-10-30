/*eslint-disable*/
import React from "react";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import CustomInput from "components/CustomInput/CustomInput.jsx";

// @material-ui/icons
import { Search} from "@material-ui/icons";

import Button from "components/CustomButtons/Button.jsx";

import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle.jsx";

function SubHeaderLinks({ ...props }) {
  const { classes } = props;
  //console.log(classes);
  return (
    <ul className="subHeader">
      <li>

        <Button href="/" color="transparent">Explore</Button>
        <Button href="https://github.com/decompanyio/decompanyio-front-end" color="transparent">Help</Button>
        <div className="sortSearch">
          <CustomInput
            inputProps={{
              placeholder: "Search",
              inputProps: {
                "aria-label": "Search"
              }
            }}
          />
          <Button justIcon color="white">
            <Search className={classes.searchIcon} />
          </Button>
        </div>
      </li>
    </ul>


  );
}

export default withStyles(headerLinksStyle)(SubHeaderLinks);
