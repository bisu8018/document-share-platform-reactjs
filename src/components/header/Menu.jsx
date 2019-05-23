import React from "react";

class Menu extends React.Component {
  state = {
    menuShow: false
  };

  menuShow = () => {
    this.setState({menuShow : true});
  };

  menuHide = () => {
    this.setState({menuShow : false});
  };

  render() {
    const { menuShow } = this.state;

    return (
      <div className="d-inline-block ">
        <i className="material-icons menu-btn d-inline-block " onClick={() => this.menuShow()}>menu</i>
        {menuShow &&
        <div className="menu-wrapper">
          <i className="material-icons menu-close-btn" onClick={() => this.menuHide()}>clear</i>
          <div className="menu-content-list">
            <div className="menu-content-item">About Us</div>
            <div className="menu-content-item">User Guide</div>
            <div className="menu-content-item">FAQ</div>
            <div className="menu-content-item">Connect With Us</div>
            <div className="menu-content-item-sub">Official Linkedin<br/>Whitepaper</div>
          </div>
        </div>
        }
      </div>
    );
  }
}


export default Menu;