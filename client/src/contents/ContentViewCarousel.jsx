
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import * as restapi from 'apis/DocApi';
import withStyles from "@material-ui/core/styles/withStyles";

const style = {
  container: {
    position: "relative",
    maxHeight:"100vh",
    maxWidth:"100vw"
  }
}

class ContentViewCarousel extends React.Component {

  constructor(props) {
    super();
    const { target, state, classes } = props;
    this.target = target;
    this.classes = classes;
    this.state = state;
  }

  render() {
    const {
      classes,
      target,
      state
    } = this.props;

    let arr = [target.totalPages];
    for (var i=0; i<target.totalPages; i++) {
      arr[i] = restapi.getPageView(target.documentId, i+1);
    }

    return (
      <div className={this.classes.container}>
        <Carousel useKeyboardArrows>
          {arr.length > 0 ? arr.map((addr, index) => (
            <img className={this.classes.img} idx={index} src={addr} />
          )):""}
        </Carousel>
      </div>
    );
  }
}

export default withStyles(style)(ContentViewCarousel);
