/*eslint-disable*/
import React from "react";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Apps, CloudUpload , Face , Person} from "@material-ui/icons";

import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import Button from "components/CustomButtons/Button.jsx";
import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle.jsx";

import UploadDocument from "upload/UploadDocument";
import LoginPopupWrapped from "./LoginPopup";
import showerhead from "shower-head.png"
import Web3Apis from "apis/Web3Apis"

const styles = theme => ({
  popper: {
    zIndex: 9000,
  },
  selbtn: {
    marginTop: '0px',
    marginRight: '7px',
    marginLeft: '0px',
    marginBottom: '12px'
  }
});

class Bounty extends React.Component {

  web3Apis = new Web3Apis();

  state = {
    available: 0,
    open: false,
    placement: 'bottom',
  }

  componentDidMount() {
    const { drizzleApis } = this.props;

    console.log("componentDidMount", this.state.available, drizzleApis.isAuthenticated() );
    if(drizzleApis.isAuthenticated()){
      this.web3Apis.getBountyAvailable(drizzleApis.getLoggedInAccount()).then((data) => {
        //console.log("getBountyAvailable", data);
        this.setState({available:data});
      }).catch((err) => {
        console.error(err);
      })
    }
  }

  handleClickButton = () => {
    this.setState(state => ({
      open: !state.open,
    }));
  };

  handleClickAgree = () => {
    const { classes, drizzleApis } = this.props;
    this.setState(state => ({
      open: !state.open,
    }));
    drizzleApis.bounty();
  }

  render() {
    const { classes, drizzleApis } = this.props;
    const { open, placement, disablePortal, flip, preventOverflow, arrow, arrowRef } = this.state;
    console.log("render", drizzleApis.isAuthenticated());

    if(this.state.available > 0) {
      return (
        <span>
          <Button id="bountyButton" color="transparent"
            buttonRef={node => {this.anchorEl = node;}}
            variant="contained"
            onClick={this.handleClickButton} style={{'textTransform': 'capitalize'}}
          ><img src={showerhead} style={{height:"18px",margin:"3px"}} /> Free DECK!! </Button>
          <Popper
            open={open}
            anchorEl={this.anchorEl}
            className={classes.popper}
          >
            <Paper className={classes.paper}>
              <DialogTitle>{"Do you need DECK?"}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  <div>New users can get 5000 DECK for free. (Gas fee is required)</div>
                  <div>You can vote for good docs with DECK and get rewarded.</div>
                </DialogContentText>
              </DialogContent>
              <DialogActions>s
                <Button className={classes.selbtn} size="sm" onClick={this.handleClickButton}>
                  Disagree
                </Button>
                <Button className={classes.selbtn} size="sm" onClick={this.handleClickAgree} color="rose">
                  Agree
                </Button>
              </DialogActions>
            </Paper>
          </Popper>
        </span>
      );
    } else {
      return null
    }


  }

}

export default withStyles(styles)(Bounty);
