import React from "react";
import "react-tabs/style/react-tabs.css";
import { Link } from "react-router-dom";

import Common from "common/Common";
import MainRepository from "../../../redux/MainRepository";
import DollarWithDeck from "../../../components/common/DollarWithDeck";
import DeckInShort from "../../../components/common/DeckInShort";
import Spinner from "react-spinkit";
import Tooltip from "@material-ui/core/Tooltip";

class AudienceTracking extends React.Component {
  state = {
    resultList: [],
    filterList: null,
    loading: false
  };

  constructor() {
    super();
    this.handleKeyUp = this.keyUpHandler.bind(this);
  }

  keyUpHandler = (e) => {
    let searchValue = document.getElementById("searchInput").value;
    let filteredResult = null;
    if (searchValue) {
      let result = this.state.resultList;
      filteredResult = result.filter(el => {
        if (el.user.length > 0) return el.user[0].e.indexOf(searchValue) !== -1;
        return false;
      });
    }
    this.setState({ filterList: filteredResult });
  };

  getTrackingList = () => {
    const { location } = this.props;

    this.setState({ loading: true });
    MainRepository.Document.getTrackingList(location.state.documentId, (res) => {
      let resData = res;
      this.setState({ loading: false });
      this.setState({ resultList: resData.resultList ? resData.resultList : [] });
    });
  };

  handleExport = () => {
    const { location } = this.props;
    console.log(123);
    MainRepository.Document.getTrackingExport(location.state.documentId, rst => {
      const a = document.createElement("a");
      a.style.display = "none";
      document.body.appendChild(a);

      a.href = rst.downloadUrl;

      a.setAttribute("download", "tracking_" + location.state.seoTitle + ".xls");
      a.click();

      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    });
  };

  componentWillMount() {
    this.getTrackingList();
  }

  render() {
    const { location, drizzleApis, match } = this.props;
    const { loading } = this.state;
    const rst = !this.state.filterList ? this.state.resultList : this.state.filterList;
    let addr = Common.getThumbnail(location.state.documentId, 320, 1);
    let badgeReward = drizzleApis.toEther(location.state.confirmAuthorReward);
    let badgeVote = drizzleApis.toEther(location.state.confirmVoteAmount);
    let badgeView = location.state.totalViewCount ? location.state.totalViewCount : 0;

    return (

      <div className="row">
        <div className="col-sm-12 col-lg-10  offset-lg-1 u__center profile-center">


          <div className="row">
            <div className="col-sm-3 col-md-3 col-thumb p-0 p-sm-3">
              <Link to={"/doc/" + location.state.seoTitle}>
                <div className="thumb_image">
                  <img src={addr}
                       alt={location.state.title ? location.state.title : location.state.documentName}
                       className="img-fluid"/>
                </div>
              </Link>
            </div>

            <div className="col-sm-9 col-md-9 col-details_info p-sm-3">
              <dl className="details_info">
                <Link to={"/doc/" + location.state.seoTitle} className="info_title mb-2">
                  {location.state.title}
                </Link>
                <div className="col-view tracking-item mb-1">
                  <span className="txt_view">{badgeView}</span>
                  <span className="view_date view-reward"><span><DollarWithDeck deck={badgeReward}
                                                                                drizzleApis={drizzleApis}/></span></span>
                  <span className="view_date view-reward"><span><DeckInShort deck={badgeVote}/></span></span>
                  <span className="ml-4 info_date"> {Common.timestampToDate(location.state.created)}</span>
                </div>
                {location &&
                <Tooltip title="Export tracking data as Excel file." placement="bottom">
                  <div className="export-btn-big" onClick={() => this.handleExport()}>
                    <i className="material-icons">save</i>
                    Export
                  </div>
                </Tooltip>
                }
              </dl>
            </div>
          </div>


          <div className="row tracking_inner">
            <div className="col-sm-12 col-md-12 tracking_top">
              <h3 className="u_title col-5 col-lg-9">Visitors</h3>

              <div className="tags_menu_search_container p-0 mb-2 col-7 col-lg-3">
                <input id="searchInput" type="text" autoComplete="off" placeholder="Name Search . . ."
                       onKeyUp={this.handleKeyUp}/>
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

                {loading && <div className="spinner"><Spinner name="ball-pulse-sync"/></div>}
                {!loading && rst.length === 0 && <div className="no-data">No data</div>}

              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default AudienceTracking;
