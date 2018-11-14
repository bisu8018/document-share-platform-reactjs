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
import showerhead from "shower-head.png"
import Web3Apis from "apis/Web3Apis"

class Bounty extends React.Component {

  web3Apis = new Web3Apis();

  state = {
    available: 0
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


  onClickBounty = () => {
    const { classes, drizzleApis } = this.props;

    drizzleApis.bounty();

  }

  render() {
    const { classes, drizzleApis } = this.props;
    console.log("render", drizzleApis.isAuthenticated());

    if(this.state.available > 0) {
      return (
        <span>
            <Button id="bountyButton" color="transparent"
              onClick={this.onClickBounty} style={{text-transform: capitalize}}
            ><img src={showerhead} style={{height:"18px"}} />Free DECK</Button>
        </span>
      );
    } else {
      return null
    }


  }

}

export default (Bounty);
