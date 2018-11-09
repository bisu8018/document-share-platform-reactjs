import React, { Component } from "react";
import Fullscreen from "react-full-screen";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/CustomButtons/Button.jsx";
import ContentViewCarousel from './ContentViewCarousel';

const style = {
  pageViewer: {
    position: "relative",
    height: "auto"
  },
  fullViewer: {
    position: "absolute",
    width: "auto",
    height: "100vh",
    display: "none"
  },
  fullscreenBar: {
    textAlign: "right",
    float:"right"
  },
  fullscreenBtn: {
    padding:"5px",
    margin:"5px",
    fontSize:"12px"
  }
}

class ContentViewFullScreen extends Component {

  constructor(props) {
    super();

    const { document, classes, drizzleApis } = props;
    this.document = document;
    //this.goNormal = goNormal;
    this.classes = classes;
    this.drizzleApis = drizzleApis;
    this.state = {
      isFull:false
    };

  }

  goFull = () => {
    this.setState({ isFull: true });
  }

  render() {

    let page = document.getElementById("page");
    let full = document.getElementById("full");

    if (page !== null) {
      if (this.state.isFull) {
        page.style.display = "none";
      } else {
        page.style.display = "block";
      }
    }

    if (full !== null) {
      if (this.state.isFull) {
        full.style.display = "block";
      } else {
        full.style.display = "none";
      }
    }

    return (

      <div className="ContentViewFullScreen">
        <Fullscreen
          enabled={this.state.isFull}
          onChange={isFull => this.setState({isFull})}
        >
          <div id="page" className={this.classes.pageViewer}>
            <ContentViewCarousel target={this.document} state={this.state} />
          </div>
          <div id="full" className={this.classes.fullViewer}>
            <ContentViewCarousel target={this.document} state={this.state} />
          </div>
        </Fullscreen>
        <div className={this.classes.fullscreenBar}>
          <Button className={this.classes.fullscreenBtn} onClick={this.goFull}>View full screen</Button>
        </div>
      </div>
    );
  }
}

export default withStyles(style)(ContentViewFullScreen);
