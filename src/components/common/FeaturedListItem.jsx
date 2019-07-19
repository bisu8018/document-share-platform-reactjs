import React from "react";
import { Link } from "react-router-dom";
import Common from "../../config/common";

class FeaturedList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ratio: null
    };
  }

  // 이미지 정보 GET
  getImgInfo = () => {
    const { resultItem } = this.props;
    let img = new Image();

    img.src = Common.getThumbnail(resultItem.documentId, 320, 1, resultItem.documentName);
    img.onload = () => {
      let height = img.height,
        width = img.width;
      this.setState({ ratio: (width / height) });
    };
  };


  componentWillMount(): void {
    this.getImgInfo();
  }


  render() {
    const { resultItem } = this.props;
    const { ratio } = this.state;
    let identification = resultItem.author ? (resultItem.author.username && resultItem.author.username.length > 0 ? resultItem.author.username : resultItem.author.email) : resultItem.accountId;

    return (
      <div className="see-also-container">

        <Link to={"/" + identification + "/" + resultItem.seoTitle}>
          <div className="see-also-thumbnail" onClick={Common.scrollTop()}>
            <img src={Common.getThumbnail(resultItem.documentId, 320, 1, resultItem.documentName)}
                 className={ratio >= 1.8 ? "see-also-card-img-landscape" : "main-category-card-img"}
                 alt={resultItem.documentName ? resultItem.documentName : resultItem.documentId}/>
          </div>
          <div className="see-also-title"> {resultItem.title} </div>
        </Link>

        <div className="see-also-content">
          <Link to={"/" + identification} className="info_name see-also-author" onClick={Common.scrollTop()}>
            {identification}
          </Link>
        </div>

      </div>
    );
  }
}

export default FeaturedList;
