import React from 'react'
import PropTypes from "prop-types";
import {hotkeys} from 'react-keyboard-shortcuts'
import Button from "components/CustomButtons/Button.jsx";

class PrevButton extends React.PureComponent  {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  }

  hot_keys = {
    'alt+p': { // combo from mousetrap
      priority: 1,
      handler: (event) => this.props.onClick(),
    },
    'left': { // combo from mousetrap
      priority: 1,
      handler: (event) => this.props.onClick(),
    },
  }

  render () {
    return (
      <Button {...this.props} onClick={this.props.onClick}> Prev</Button>
    )
  }
}

export default hotkeys(PrevButton)
