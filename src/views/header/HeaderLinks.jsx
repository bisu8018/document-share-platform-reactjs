/*eslint-disable*/
import React from "react";
//import { Link } from "react-router-dom";

import {Apps, CloudUpload, Face, Person} from "@material-ui/icons";
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import Button from "components/custom/HeaderButton";
import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle";
import UploadDocument from "components/upload/UploadDocument";
import LoginPopupWrapped from "./LoginPopup";
import Bounty from "./Bounty"

class HeaderLinks extends React.Component {
    state = {
        displayName: null,
        intervalId: null
    };

    componentDidMount() {
        const {classes, auth, drizzle, drizzleState} = this.props;
        /*
        this.unsubscribe = drizzle.store.subscribe(() => {

          // every time the store updates, grab the state from drizzle
          const drizzleState = drizzle.store.getState();
          // check to see if it's ready, if so, update local component state
          if (drizzleState.drizzleStatus.initialized) {
            console.log(drizzleState);
            this.setState({drizzleState: drizzleState});
            this.setState({displayName: this.state.drizzleState.accounts[0]});
          }
        });*/
    }

    componentWillUnmount() {
        //this.unsubscribe();
    }

    render() {
        const {classes, drizzleApis, auth} = this.props;
        //console.log("HeaderLinks render()", drizzleApis);
        if (!auth.isAuthenticated()) {
            return (

                <List className={classes.list}>
                    <ListItem className={classes.listItem}>
                         <LoginPopupWrapped {...this.props}/>
                    </ListItem>
                </List>

            );
        }

        return (

            <List className={classes.list}>
                <ListItem className={classes.listItem}>
                    <Bounty drizzleApis={drizzleApis} />
                    <UploadDocument {...this.props} />
                    {/*  {
                      <Link to={"/author/" + drizzleApis.getLoggedInAccount()} style={{ color: '#8b8b8b' }}>
                        <Button id="address" color="transparent" className={classes.button} >
                          <Person className={classes.icons} />
                            {drizzleApis.getLoggedInAccount()}
                        </Button>
                      </Link>
                      }*/}

                    {auth.isAuthenticated() &&
                    <Button color="transparent" className={classes.button} onClick={auth.logout}>
                        <Person className={classes.icons}/> {auth.getUserInfo().nickname}
                    </Button>
                    }
                    {!auth.isAuthenticated() &&
                    <Button color="transparent" className={classes.navLink} onClick={auth.login}><Person
                        className={classes.icons}/> Log-in</Button>
                    }

                </ListItem>
            </List>

        );
    }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
