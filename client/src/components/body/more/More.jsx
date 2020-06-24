import React from "react";
import TagList from "../../../redux/model/TagList";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";


class More extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tagList: new TagList().resultList
    };
  }

  render() {
    const { tagList } = this.state;

    return (
      <div className="row container mb-5">
        <Helmet>
          <title>{"More | Polaris Share"}</title>
        </Helmet>

        <div className="col-12 mb-5 mt-3">
          <div className="legal-subject mt-3 mb-5">More tags</div>
          <div className="row justify-content-center">
          {tagList.length > 0 && tagList.sort().map((result, idx) => (
              <Link to={'/latest/' + result} className="more-tag-item" key={idx}># {result}</Link>
          ))}
          </div>
        </div>
      </div>
    );
  }
}

export default More;
