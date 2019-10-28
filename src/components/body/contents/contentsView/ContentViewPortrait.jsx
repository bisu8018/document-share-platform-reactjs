import React from "react";
import MainRepository from "../../../../redux/MainRepository";
import { APP_PROPERTIES } from "../../../../properties/app.properties";

class ContentViewCarousel extends React.Component {

  state = {
    page: 0
  };


  // 스크롤 관리
  handleOnScroll = e => {
    let page = parseInt(e.target.scrollTop / e.target.offsetHeight);
    if (this.state.page !== page) {
      this.setState({ page: page }, () => {
        this.props.onChange(page);
      });
    }
  };


  componentDidMount() {
    if (APP_PROPERTIES.ssr) return;

    let ele = document.getElementById("contentViewPortraitWrapper");
    let height = Number(ele.offsetWidth / this.props.ratio);
    let page = window.location.pathname.split("/")[3];
    page = page ? page.split("-")[0] : 0;
    ele.style.maxHeight = height + "px";
    ele.scrollTop = (page > 0 ? page - 1 : 0) * height;
  };


  render() {
    const { arr, getDocument, emailFlag } = this.props;


    return (
      <div id={"contentViewPortraitWrapper"} className='content-view-portrait-wrapper'
           onScroll={e => this.handleOnScroll(e)}>
        {arr.length > 0 ? arr.map((addr, idx) => (
          <img key={idx}
               title={getDocument.document.title}
               src={addr}
               alt={getDocument.text[idx]}
               data-small=""
               data-normal=""
               data-full=""
               className={(getDocument.document.forceTracking && emailFlag && !MainRepository.Account.isAuthenticated() ? "img-cloudy" : "")}/>
        )) : "no data"}
      </div>
    );
  }
}

export default ContentViewCarousel;
