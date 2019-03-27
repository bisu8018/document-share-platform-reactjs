import React from "react";
import "react-tabs/style/react-tabs.css";
import LinesEllipsis from "react-lines-ellipsis";
import { Link } from "react-router-dom";

import Common from "common/Common";
import MainRepository from "../../../redux/MainRepository";
import DollarWithDeck from "../../../components/common/DollarWithDeck";
import DeckInShort from "../../../components/common/DeckInShort";

class AudienceTracking extends React.Component {
  state = {
    resultList: [],
    filterList: null
  };

  constructor() {
    super();
    this.handleKeyUp = this.keyUpHandler.bind(this);
  }

  keyUpHandler = (e) => {
    let searchValue = document.getElementById('searchInput').value;
    let filteredResult = null;
    if(searchValue){
      let result = this.state.resultList;
      filteredResult = result.filter(el => {
        if(el.user.length > 0) return el.user[0].e.indexOf(searchValue) !== -1
        return false;
      });
    }
    this.setState({filterList : filteredResult});
  };

  print = () => {
    const { location } = this.props;
    MainRepository.Document.getTrackingList(location.state.documentId, (res) => {
      let resData = res;
      this.setState({ resultList: resData.resultList ? resData.resultList : [] });
    });
  };

  componentWillMount() {
    this.print();
  }

  render() {
    const { location, drizzleApis, match } = this.props;
    const rst = !this.state.filterList ? this.state.resultList : this.state.filterList;
    const addr = Common.getThumbnail(location.state.documentId, 1);
    const badgeReward = drizzleApis.toEther(location.state.confirmAuthorReward);
    const badgeVote = drizzleApis.toEther(location.state.confirmVoteAmount);
    const badgeView = location.state.totalViewCount ? location.state.totalViewCount : 0;

    return (

      <div className="row">
        <div className="col-sm-12 col-lg-10  offset-lg-1 u__center profile-center">
          <div className="row">


            <div className="col-sm-3 col-md-3 col-thumb">
              <Link to={"/doc/" + location.state.documentId}>
                <div className="thumb_image">
                  <img src={addr}
                       alt={location.state.title ? location.state.title : location.state.documentName}
                       className="img-fluid"/>
                </div>
              </Link>
            </div>


            <div className="col-sm-9 col-md-9 col-details_info">
              <dl className="details_info">
                <Link to={"/doc/" + location.state.documentId} className="info_title">
                  {location.state.title}
                </Link>
                <Link to={"/author/" + location.state.accountId} title={"Go to profile page of " + (location.state.nickname ? location.state.nickname : location.state.accountId) } className="info_name">
                  <i className="material-icons img-thumbnail">face</i>
                  {location.state.nickname ? location.state.nickname : location.state.accountId}
                </Link>
                <Link to={"/doc/" + location.state.documentId} className="info_desc">
                  <LinesEllipsis
                    text={location.state.desc}
                    maxLine='2'
                    ellipsis='...'
                    trimRight
                    basedOn='letters'
                  />
                </Link>
                <div className="col-view">
                  <span className="txt_view">{badgeView}</span>
                  <span className="view_date view-reward">Reward <span><DollarWithDeck deck={badgeReward}
                                                                                       drizzleApis={drizzleApis}/></span></span>
                  <span className="view_date view-reward"><span><DeckInShort deck={badgeVote}/></span></span>
                  <span className="view_date"> {Common.timestampToDateTime(location.state.created)}</span>
                </div>
              </dl>
            </div>
          </div>


          <div className="row tracking_inner">
            <div className="col-sm-12 col-md-12 tracking_top">
                <h3 className="u_title">Visitors</h3>
                <div className="tags_menu_search_container">
                    <input id="searchInput" type="text" autoComplete="off" placeholder="Name Search . . ." onKeyUp={this.handleKeyUp}/>
                    <div className="search-btn">
                      <i className="material-icons">search</i>
                    </div>
              </div>

              <div className="tracking_table">
                <table border="0" cellSpacing="0" cellPadding="0">
                  <tbody>
                  <tr>
                    <th className="col1">Name <br/> (job title)</th>
                    <th className="col2">Views</th>
                    <th className="col3">Last <br/> viewed</th>
                  </tr>
                  {rst.map((result, idx) => (
                    <tr key={idx}>
                      <td className="col1">
                        <Link to={{
                          pathname: "/trackingDetail/" + match.params.accountId + "/" + location.state.documentId,
                          state: { document: location.state, addr: addr, cid: result.cid }
                        }}>
                          {result.user.length > 0 && result.user[0].e !== "null" ? result.user[0].e : "Anonymous"}
                        </Link>
                      </td>
                      <td className="col2">{result.count}</td>
                      <td
                        className="col3">{Common.dateAgo(result.viewTimestamp) === 0 ? "Today" : Common.dateAgo(result.viewTimestamp) + " days ago"} </td>
                    </tr>
                  ))}
                  </tbody>
                </table>

                {rst.length === 0 && <div className="no-data">No data</div>}

              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default AudienceTracking;
