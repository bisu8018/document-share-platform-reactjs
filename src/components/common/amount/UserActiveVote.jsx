import React from "react";
import Common from "../../../common/common";

class UserActiveVote extends React.Component {

  state = {
    userActiveVote: 0,
    anchorEl: null,
    open: false
  };

  componentWillMount() {
    this.setState({ userActiveVote: 0 });
  }

  handleClose = () => {
    if (!this.state.open) return;
    this.setState({ open: false });
  };

  render() {
    const userActiveVote = this.state.userActiveVote,
      textDeck = Common.toEther(userActiveVote ? userActiveVote : 0).toFixed(2),
      textDollar = Common.toDollar(userActiveVote).toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;

    return (
      <span>
        <span className="color-main-color font-weight-bold">{textDeck}</span> DECK
        ($ <span className="color-main-color">{textDollar}</span>)
        </span>
    );
  }
}

export default UserActiveVote;
