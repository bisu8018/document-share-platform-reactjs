import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
  root: {
    height: 380,
  },
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,
  },
});

const actions = [
  { icon: <FileCopyIcon />, name: '목록', value: "list" },
  { icon: <SaveIcon />, name: '등록', value: "upload" },
  /*
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
  { icon: <DeleteIcon />, name: 'Delete' },
  */
];

class SpeedDials extends React.Component {
  state = {
    open: false,
    hidden: false,
  };

  handleVisibility = () => {

    this.setState(state => ({
      open: false,
      hidden: !state.hidden,
    }));

  };

  handleClick = (e, value) => {
    console.log("handleClick", e, value)
    if(value){
      this.props.handler(e);
    }


    this.setState(state => ({
      open: !state.open,
    }));

  };

  handleOpen = () => {

    if (!this.state.hidden) {
      this.setState({
        open: true,
      });
    }

  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { classes, handler } = this.props;
    const { hidden, open } = this.state;

    let isTouch;
    if (typeof document !== 'undefined') {
      isTouch = 'ontouchstart' in document.documentElement;
    }

    return (
      <div className={classes.root}>
        <Button onClick={this.handleVisibility}>Toggle Speed Dial</Button>
        <SpeedDial
          ariaLabel="SpeedDial example"
          className={classes.speedDial}
          hidden={hidden}
          icon={<SpeedDialIcon />}
          onBlur={this.handleClose}
          onClick={this.handleClick}
          onClose={this.handleClose}
          onFocus={isTouch ? undefined : this.handleOpen}
          onMouseEnter={isTouch ? undefined : this.handleOpen}
          onMouseLeave={this.handleClose}
          open={open}
        >
          {actions.map(action => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={this.handleClick.bind(this, action.value)}
            />
          ))}
        </SpeedDial>
      </div>
    );
  }
}

SpeedDials.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SpeedDials);
