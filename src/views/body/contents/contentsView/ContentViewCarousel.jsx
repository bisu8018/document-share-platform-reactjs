import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

import * as restapi from "apis/DocApi";
import TrackingApis from "apis/TrackingApis";

import withStyles from "@material-ui/core/styles/withStyles";


const style = {
  container: {
    position: "relative",
    maxWidth: "100vw"
  }
};

class ContentViewCarousel extends React.Component {

  constructor(props) {
    super(props);
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

  };

  componentWillMount() {

    const { tracking, target } = this.props;
    let documentId = target.documentId;
    if (tracking) {
      this.handleTracking(documentId, 1);
      window.addEventListener("unload", function _handler() {
        try {
          TrackingApis.tracking({
            id: documentId,
            n: -1,
            e: "tracking_tester@decompany.io",
            ev: "leave"
          }, false, true);
        } catch (e) {
          console.error(e);
        }
        window.removeEventListener("unload", _handler);
      });
    }

  }

  render() {
    const { target } = this.props;

    const arr = [target.totalPages];
    for (let i = 0; i < target.totalPages; i++) {
      arr[i] = restapi.getPageView(target.documentId, i + 1);
    }

    return (
      <div className="card card-raised">
        <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel" data-interval="3000">

          <Carousel
            showThumbs={false}
            showIndicators={false}
            swipeable
            onChange={(index) => {
              this.handleTracking(target.documentId, index + 1);
              return true;
            }}>
            {arr.length > 0 ? arr.map((addr, index) => (
              <img className={this.classes.img} key={index} src={addr} alt={"carousel"}/>
            )) : ""}
          </Carousel>

        </div>
      </div>
    );
  }
}

export default withStyles(style)(ContentViewCarousel);
