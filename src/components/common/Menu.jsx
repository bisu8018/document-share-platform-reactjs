import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from "react-router-dom";
import ListItemIcon from "@material-ui/core/ListItemIcon";


class Menu extends React.Component {
  state = {
    top: false,
    left: false,
    bottom: false,
    right: false,
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render() {
    const { auth } = this.props;
    let userInfo = auth.getUserInfo();

    const sideList = (
      <div >
        <List>
          {!this.state.accountId &&
          <ListItem button className="d-sm-none">
            <ListItemIcon>
          <Link to={"/author/" + this.state.accountId} className="avatar-menu">
            {userInfo.nickname[0]}
          </Link>
            </ListItemIcon>
            <ListItemText primary= {userInfo.nickname}/>

          </ListItem>
          }

          {auth.isAuthenticated() ?
            <ListItem button onClick={auth.logout()}>
              <ListItemText primary="Log-out"/>
            </ListItem> :
            <ListItem>
              <ListItemText primary="Log-in"/>
            </ListItem>
          }
        </List>
        <Divider />
      </div>
    );

    return (
      <div>
        <i className="material-icons menu-btn"  onClick={this.toggleDrawer('right', true)}>menu</i>

        <Drawer anchor="right" open={this.state.right} onClose={this.toggleDrawer('right', false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('right', false)}
            onKeyDown={this.toggleDrawer('right', false)}
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}


export default Menu;