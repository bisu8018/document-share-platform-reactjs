import React from "react";
import { APP_PROPERTIES } from "properties/app.properties";

class ContentViewComment extends React.Component {
  /**
   *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
   *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/


  /*  // 디스커스 셋팅
  setConfig = () => {
    this.page.url = "https://share.decompany.io";  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = "polarishare"; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
  };*/


  //디스커스 초기화
  init = () => {
    let d = document, s = d.createElement("script");
    s.src = "https://" + (APP_PROPERTIES.env === "production" ? "polaris-share" : "polarishare") + ".disqus.com/embed.js";
    s.setAttribute("data-timestamp", +new Date());
    (d.head || d.body).appendChild(s);
  };


  componentWillMount(): void {
    this.init();
  }

  render() {

    return (
      <div id="disqus_thread" className="mb-sm-5 mb-2"/>
    );
  }
}

export default ContentViewComment;
