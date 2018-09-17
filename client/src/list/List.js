import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import PageView from './PageView'
import SetString from "../SetString";

import axios from 'axios';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6,
  },
});

const domain = "https://24gvmjxwme.execute-api.us-west-1.amazonaws.com";
const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
var resultList = [];

function init(){
  axios.get(domain + '/prod/document/list')
  .then(function (response, err) {
    if(err){
      console.error(err);
      return;
    }
    console.log(response.data);
    resultList = response.data.body;
  })
  .catch(function (error) {
    console.log(error);
  });
}

init();

function handlePageView(fileid) {

  console.log(fileid);
  //PageView.setOpen(true);

}

function Album(props) {

  const imageUrl = (fileid, fileindex) => domain+ "/prod/document/get/" + fileid + "/" + fileindex;
  const pageUrl = (fileid) => domain+ "/prod/document/get/" + fileid;


  const { classes } = props;
  return (
    <React.Fragment>
      <main>
        <div className={classNames(classes.layout, classes.cardGrid)}>
          {/* End hero unit */}
          <Grid container spacing={40}>
            {resultList.map(result => (
              <Grid item key={result} sm={6} md={4} lg={3}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={imageUrl(result.fileid, result.fileindex)}
                    title={result.fileid}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="headline" component="h2">
                      {result.fileid}
                    </Typography>
                    <Typography>
                      {domain}/{result.fileid}/{result.fileindex}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" onClick="{handlePageView(result.fileid)}">
                      View
                    </Button>
                    <Button size="small" color="primary">
                      Vote
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <PageView />
        </div>
      </main>
    </React.Fragment>
  );
}

Album.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Album);
