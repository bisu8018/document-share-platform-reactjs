import React from 'react'
import PropTypes from "prop-types";
import {hotkeys} from 'react-keyboard-shortcuts'
import Button from "components/CustomButtons/Button.jsx";

class NextButton extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  }

  hot_keys = {
    'alt+n': { // combo from mousetrap
      priority: 1,
      handler: (event) => this.props.onClick(),
    },
    'right': { // combo from mousetrap
      priority: 1,
      handler: (event) => this.props.onClick(),
    },
  }

  render () {
    return (
      <Button {...this.props} onClick={this.props.onClick}> Next</Button>
    )
  }
}

export default hotkeys(NextButton)
