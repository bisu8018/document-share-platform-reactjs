import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  top_menu: {
    textAlign: 'center',
  },
  button: {
    margin: theme.spacing.unit,

  },
});

function TopMenu(props) {
  const { classes, auth } = props;



  return (
    <div className={classes.top_menu}>
      <Button size="small" className={classes.button} component={Link} to="/">
        Home
      </Button>
      <Button size="small" className={classes.button} component={Link} to="/">
        Latest
      </Button>
      <Button size="small" className={classes.button} component={Link} to="/">
        MyPage
      </Button>
      <Button size="small" className={classes.button} component={Link} to="/upload">
        Upload
      </Button>
    </div>
  );
}

TopMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopMenu);
