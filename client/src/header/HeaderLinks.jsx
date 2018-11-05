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
import LoginPopupWrapped from "./LoginPopup";

class HeaderLinks extends React.Component {

  state = {
    displayname: null,
    intervalId: null
  }

  componentDidMount() {
    const { classes, auth, drizzle, drizzleState } = this.props;
    /*
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();
      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        console.log(drizzleState);
        this.setState({drizzleState: drizzleState});
        this.setState({displayname: this.state.drizzleState.accounts[0]});

      }

    });
    */
  }

  compomentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { classes, drizzle, drizzleState, drizzleApis} = this.props;
    //console.log("HeaderLinks render()", drizzleApis);

    if(!drizzleApis.isAuthenticated()) {
      return (
        <List className={classes.list}>
          <ListItem className={classes.listItem}>
            <LoginPopupWrapped />
          </ListItem>
        </List>
      );
    }

    return (
      <List className={classes.list}>
        <ListItem className={classes.listItem}>
          <UploadDocument drizzleApis={drizzleApis} />
          <Button id="address" color="transparent" className={classes.button} >
            <Person className={classes.icons} /> <Link to={"/author/" + drizzleApis.getLoggedInAccount()} style={{ color: '#8b8b8b' }}> {drizzleApis.getLoggedInAccount()}</Link>
          </Button>
          {/*
          {auth.isAuthenticated() &&
            <Button color="transparent" className={classes.button} onClick={auth.logout} >
              <Person className={classes.icons} /> {auth.getUserInfo().nickname}
            </Button>
          }
          {!auth.isAuthenticated() &&
            <Button color="transparent" className={classes.navLink} onClick={auth.login} ><Person className={classes.icons} /> Log-in</Button>
          }
          */}
        </ListItem>
      </List>

    );
  }

}

export default withStyles(headerLinksStyle)(HeaderLinks);
