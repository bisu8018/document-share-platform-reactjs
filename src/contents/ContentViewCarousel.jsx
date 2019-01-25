
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import * as restapi from 'apis/DocApi';
import withStyles from "@material-ui/core/styles/withStyles";

const style = {
  container: {
    position: "relative",
    maxWidth:"100vw"
  }
}

class ContentViewCarousel extends React.Component {

  constructor(props) {
    super();
    const { target, classes } = props;
    this.target = target;
    this.classes = classes;
  }

  render() {
    const {
      classes,
      target,
      page,
      onChange
    } = this.props;

    let arr = [target.totalPages];
    for (var i=0; i<target.totalPages; i++) {
      arr[i] = restapi.getPageView(target.documentId, i+1);
    }

    return (
      <div className={this.classes.container}>
        <Carousel useKeyboardArrows onChange={onChange} selectedItem={page}>
          {arr.length > 0 ? arr.map((addr, index) => (
            <img className={this.classes.img} key={index} src={addr} />
          )):""}
        </Carousel>
      </div>
    );
  }
}

export default withStyles(style)(ContentViewCarousel);
