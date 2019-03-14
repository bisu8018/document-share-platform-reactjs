import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import TrackingApis from "apis/TrackingApis";
import Common from "../../../../common/Common";

class ContentViewCarousel extends React.Component {

  state = {
    isFull: false,
    dataKey: null,
    totalPages: 0,
    readPage: 0
  };

  handleTracking = (documentId, page) => {
    if(page !== 1){
      let pageNum = Number(page.key.split('$')[1]);
      if(pageNum === this.state.readPage) return;
      this.setState({readPage : pageNum});
    }
    TrackingApis.tracking({
      id: documentId,
      n: page,
      ev: "view"
    }, true);
  };

  componentWillMount() {
    const { tracking, target } = this.props;
    let documentId = target.documentId;
    if (tracking) {
      this.handleTracking(documentId, 1);
    }
  }

  componentWillUnmount() {
    const { target } = this.props;
    let documentId = target.documentId;
    try {
      TrackingApis.tracking({
        id: documentId,
        n: -1,
        ev: "leave"
      }, false, true);
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { target } = this.props;

    const arr = [target.totalPages];
    for (let i = 0; i < target.totalPages; i++) {
      arr[i] = Common.getPageView(target.documentId, i + 1);
    }
    return (
      <div className="card card-raised">
        <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel" data-interval="3000">

          <Carousel
            showThumbs={false}
            showIndicators={false}
            swipeable
            selectedItem= {this.state.readPage}
            useKeyboardArrows={true}
            onChange={this.handleTracking.bind(this)}
          >

            {arr.length > 0 ? arr.map((addr, index) => (
              <img  key={index} src={addr} alt={"carousel"}/>
            )) : "no data"}

          </Carousel>

        </div>
      </div>
    );
  }
}

export default ContentViewCarousel;
