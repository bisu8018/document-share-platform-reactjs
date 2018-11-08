import React, { Component } from "react";
import Fullscreen from "react-full-screen";
import * as restapi from 'apis/DocApi';
import { NavigateBefore, NavigateNext, Face } from "@material-ui/icons";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/CustomButtons/Button.jsx";
import goFull from './fullscreen.svg';
import arrowRight from 'assets/img/right-arrow.png';
import arrowLeft from 'assets/img/left-arrow.png';
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.jsx";

const style = {
  img: {
    maxHeight:"100vh",
    width:"auto"
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
      currentPageNo: 1,
      isFull:false,
      width: 0,
      height: 0
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  goFull = () => {
    this.setState({ isFull: true });
  }

  goPrevPage = () => {
    let newPageNo = this.state.currentPageNo - 1;
    if(newPageNo<1){
      newPageNo = 1;
    }
    this.setState({currentPageNo: newPageNo})
  }

  goNextPage = () => {
    let newPageNo = this.state.currentPageNo + 1;
    if(newPageNo> this.document.totalPages){
      newPageNo = this.document.totalPages;
    }

    this.setState({currentPageNo: newPageNo})
  }

  handleMove = (event) => {

    let arrowRight = document.getElementById("right-arrow");
    let arrowLeft = document.getElementById("left-arrow");

    if (event == undefined) {
      if (arrowRight != undefined && arrowRight.style != undefined) {
        arrowRight.style.display = "none";
        arrowLeft.style.display = "none";
      }
      return;
    }

    console.log("event.pageX : " + event.pageX + ", event.pageY : " + event.pageY);
    console.log("this.state.isFull : " + this.state.isFull);

    if (this.state.isFull) {
      if (event.pageX > this.state.width * 0.7) {
        arrowRight.style.display = "block";
        arrowRight.style.width = "100px";
        arrowRight.style.height = "50px";
        arrowRight.style.left = "88%";
        arrowRight.style.top = "35%";
      } else {
        arrowRight.style.display = "none";
      }
      if (event.pageX < this.state.width * 0.3) {
        arrowLeft.style.display = "block";
        arrowLeft.style.width = "100px";
        arrowLeft.style.height = "50px";
        arrowLeft.style.left = "5%";
        arrowLeft.style.top = "35%";
      } else {
        arrowLeft.style.display = "none";
      }
    } else {
      arrowRight.style.display = "none";
      arrowLeft.style.display = "none";
    }

  }

  handleClick = (event) => {
    if (event != undefined && this.state.isFull) {
      let arrowRight = document.getElementById("right-arrow");
      let arrowLeft = document.getElementById("left-arrow");
      if (event.pageX > this.state.width * 0.7) {
        this.goNextPage();
      } else if(event.pageX < this.state.width * 0.3) {
        this.goPrevPage();
      }
    }
  }

  render() {

    return (

      <div className="ContentViewFullScreen">
        <Fullscreen
          enabled={this.state.isFull}
          onChange={isFull => this.setState({isFull})}
        >
          <div className="slideShow">
              <div className="img">
                <img className={this.classes.img} src={restapi.getPageView(this.document.documentId, this.state.currentPageNo)} onMouseMove={this.handleMove} onClick={this.handleClick}/>
                <img id="right-arrow" src={arrowRight} style={{position:"absolute",width:"100px",height:"50px",display:"none"}}/>
                <img id="left-arrow" src={arrowLeft} style={{position:"absolute",width:"100px",height:"50px",display:"none"}}/>
              </div>
              <CustomLinearProgress
               variant="determinate"
               color="gray"
               value={(this.state.currentPageNo/this.document.totalPages) * 100}
               style={{ width: "100%", height:'3px', display: "block" ,marginBottom: "0"}}
              />
              <div className="slideBtn">
                <Button color="transparent" className="prev" onClick={this.goPrevPage}><NavigateBefore className={this.classes.icons} /> <span>Prev</span></Button>
                <span>{this.state.currentPageNo} / {this.document.totalPages}</span>
                <Button color="transparent" className="next" onClick={this.goNextPage}><span>Next</span> <NavigateNext className={this.classes.icons} /></Button>
                <button onClick={this.goFull}>
                  <img width="20px" src={goFull}/>
                </button>
              </div>
          </div>
        </Fullscreen>
      </div>
    );
  }
}

export default withStyles(style)(ContentViewFullScreen);
