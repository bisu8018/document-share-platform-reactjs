
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import * as restapi from 'apis/DocApi';
import TrackingApis from 'apis/TrackingApis';
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

  handleTracking = (documentId, page) => {
 
    TrackingApis.tracking({
      id: documentId,
      n: page,
      e: "tracking_tester@decompany.io",
      ev: "view"
    }, true);

  }

  componentWillMount() {
    
    const {tracking, target} = this.props
    const documentId = target.documentId;
    if(tracking){
      this.handleTracking(documentId, 1);
      window.addEventListener("unload", function _handler(event) {
        try{
          TrackingApis.tracking({
            id: documentId,
            n: -1,
            e: "tracking_tester@decompany.io",
            ev: "leave"
          }, false, true);
        } catch(e){
          console.error(e);
        }
        window.removeEventListener("unload", _handler);

      });
    }
    
  }

  render() {
    const {
      classes,
      target
    } = this.props;

    let arr = [target.totalPages];
    for (var i=0; i<target.totalPages; i++) {
      arr[i] = restapi.getPageView(target.documentId, i+1);
    }

    return (
      <div className={this.classes.container}>
        <Carousel onChange={(index)=>{
          this.handleTracking(target.documentId, index+1);
          return true;
        }}>
          {arr.length > 0 ? arr.map((addr, index) => (
            <img className={this.classes.img} key={index} src={addr} />
          )):""}
        </Carousel>
      </div>
    );
  }
}

export default withStyles(style)(ContentViewCarousel);
