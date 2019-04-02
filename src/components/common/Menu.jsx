import React from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import UploadDocumentModal from "../modal/UploadDocumentModal";
import MainRepository from "../../redux/MainRepository";

class Menu extends React.Component {
  state = {
    top: false,
    left: false,
    bottom: false,
    right: false
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
  };

  handleLogout = () => {
    MainRepository.Account.logout();
  };

  handleLogin = () => {
    MainRepository.Account.login();
  };

  render() {
    let userInfo = MainRepository.Account.getMyInfo();

    const sideList = (
      <div>
        <List>
          {MainRepository.Account.isAuthenticated() &&
          <ListItem button className="d-sm-none">
            <ListItemIcon>
              <Link to={"/author/" + this.state.accountId} className="avatar-menu">
                <img src={userInfo.picture} className="avatar" alt="user profile"/>
              </Link>
            </ListItemIcon>
            <ListItemText primary={userInfo.username}/>
          </ListItem>
          }

          {MainRepository.Account.isAuthenticated() ?
            <ListItem button onClick={this.handleLogout.bind(this)}>
              <ListItemIcon>
                <i className="material-icons">power_settings_new</i>
              </ListItemIcon>
              <ListItemText primary="Log-out" />
            </ListItem> :
            <ListItem button onClick={this.handleLogin.bind(this)}>
              <ListItemIcon>
                <i className="material-icons">create</i>
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
          }
        </List>
        <Divider/>
      </div>
    );

    return (
      <span>
        <i className="material-icons menu-btn d-inline-block " onClick={this.toggleDrawer("right", true)}>menu</i>

        <Drawer anchor="right" open={this.state.right} onClose={this.toggleDrawer("right", false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer("right", false)}
            onKeyDown={this.toggleDrawer("right", false)}
          >
            {sideList}
          </div>
          <ListItem button className="d-sm-none d-flex">
            <ListItemIcon>
              <i className="material-icons">cloud_upload</i>
            </ListItemIcon>
            <ListItemText>
              <UploadDocumentModal {...this.props} type='menu'/>
            </ListItemText>
          </ListItem>
        </Drawer>
      </span>
    );
  }
}


export default Menu;