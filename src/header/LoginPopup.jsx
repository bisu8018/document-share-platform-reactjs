/*eslint-disable*/
import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import ListItem from "@material-ui/core/ListItem";

// @material-ui/core components
import { Apps, CloudUpload , Face , Person} from "@material-ui/icons";

const _styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 70,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  }
});

class LoginPopup extends React.Component {

  state = {
    open: false
  }

  handleOpen = () => {
    //this.setState({ open: true });
    const {auth} = this.props;
    auth.login();
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  refresh = () => {
    location.reload();
  };

  render() {
    const {classes} = this.props;

    return (
      <div>
        <Button id="address" color="default" className={classes.button} onClick={this.handleOpen} >
          <Person className={classes.icons} /> Log-in
        </Button>
        <Modal
           aria-labelledby="simple-modal-title"
           aria-describedby="simple-modal-description"
           open={this.state.open}
           onClose={this.handleClose}
         >
           <div style={{top: '50%',left: '50%',transform: 'translate(-50%, -50%)'}} className={classes.paper}>
             <Typography variant="title" id="modal-title">
             Please log in to Rinkeby with Metamask
             </Typography>
             <Typography variant="caption" id="simple-modal-description">
             After logging in, you can get DECK tokens by sharing or voting documents.
             </Typography>
             <Button color="default" className={classes.button} onClick={this.refresh} >
               <Apps className={classes.icons} /> Refresh
             </Button>
           </div>
         </Modal>
       </div>
    );

  }

}

LoginPopup.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const LoginPopupWrapped = withStyles(_styles)(LoginPopup);

export default LoginPopupWrapped;
