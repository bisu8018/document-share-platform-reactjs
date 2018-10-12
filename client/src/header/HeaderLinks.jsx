/*eslint-disable*/
import React from "react";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";
import { Apps, CloudUpload , Face , Person} from "@material-ui/icons";

import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import Button from "components/CustomButtons/Button.jsx";
import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle.jsx";

import UploadDocument from "upload/UploadDocument";

function HeaderLinks({ ...props }) {
  const { classes, auth, drizzle, drizzleState } = props;
  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <UploadDocument auth={auth} drizzle={drizzle} drizzleState={drizzleState} />
        {auth.isAuthenticated() &&
          <Button color="transparent" className={classes.button} onClick={auth.logout} >
            <Person className={classes.icons} /> {auth.getUserInfo().nickname}
          </Button>
        }
        {!auth.isAuthenticated() &&
          <Button color="transparent" className={classes.navLink} onClick={auth.login} ><Person className={classes.icons} /> Log-in</Button>
        }
      </ListItem>
    </List>


  );
}

export default withStyles(headerLinksStyle)(HeaderLinks);
