import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { NavigateBefore, NavigateNext, Face } from "@material-ui/icons";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Badge from "components/Badge/Badge.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import * as restapi from 'apis/DocApi';

const style = {

};

class ContentView extends React.Component {
  state = {
    document:null,
    currentPageNo:1
  }

  getContentInfo = (documentId) => {
    restapi.getDocument(documentId).then((res) => {
        this.setState({document:res.data.document});
    });
  }

  goNextPage = () => {
    let newPageNo = this.state.currentPageNo + 1;
    if(newPageNo>document.totalPages){
      newPageNo = document.totalPages;
    }

    this.setState({currentPageNo: newPageNo})
  }

  goPrevPage = () => {
    let newPageNo = this.state.currentPageNo - 1;
    if(newPageNo<1){
      newPageNo = 1;
    }
    this.setState({currentPageNo: newPageNo})
  }

  componentDidMount() {
    const { match} = this.props;
    const documentId = match.params.documentId;
    this.getContentInfo(documentId);
  }

  render() {
    const { classes, match} = this.props;
    const document = this.state.document;

    console.log(document);

    if(!document) return "Loading";

    return (
        <div className="contentGridView">

           <div className="leftWrap">
               <div className="slideShow">
                   <div className="img"><img src={restapi.getPageView(document.documentId, this.state.currentPageNo)} alt=""/></div>
                   <CustomLinearProgress
                    variant="determinate"
                    color="gray"
                    value={(this.state.currentPageNo/document.totalPages) * 100}
                    style={{ width: "100%", height:'3px', display: "block" ,marginBottom: "0"}}
                  />
                    <div className="slideBtn">
                       <Button color="transparent" className="prev" onClick={this.goPrevPage}><NavigateBefore className={classes.icons} /> <span>Prev</span></Button>
                       <Button color="transparent" className="next" onClick={this.goNextPage}><span>Next</span> <NavigateNext className={classes.icons} /></Button>
                   </div>
               </div>


               <h2 className="tit">{document.title?document.title:""}</h2>
               <div>
                   <Button color="rose" size="sm">Like</Button>
                   <Button color="rose" size="sm">Share</Button>
                   <Button color="rose" size="sm">Download</Button>
               </div>

                <a href="#">
                    <div className="profileImg">
                       <span className="userImg">
                           <Face className={classes.icons} />
                           <img src="http://i.imgur.com/UGzF2lv.jpg" alt=""/>
                       </span>
                       <strong className="userName">{document.accountId}
                           <span className="txt">Author profile (provide a link to author page)</span>
                        </strong>
                   </div>
                   <div className="proFileDescript">{document.desc?document.desc:""}</div>
                </a>

              <h3 className="tit02">Document Information</h3>
              <ul className="detailList">
                <li>daily page views : 123</li>
                <li>total voting : 12</li>
                <li>total earning : 1</li>
                <li>....</li>
                <li>....</li>
                <li>....</li>
                <li>....</li>
              </ul>
           </div>


           <div className="rightWrap">
               <h3>Voting</h3>

               <h4>1. Total amount of tokens voted</h4>
               <ul className="voteList">
                   <li><strong>You : </strong> <span>0.00 DECK</span></li>
                   <li><strong>Total : </strong> <span>0.00 DECK</span></li>
               </ul>

               <h4>2. Total amount of tokens earned</h4>
               <ul className="voteList">
                   <li><strong>You : </strong> <span>0.00 DECK</span></li>
                   <li><strong>Total : </strong> <span>0.00 DECK</span></li>
               </ul>

               <h4>3. Amount of available tokens</h4>
               <ul className="voteList">
                   <li><strong></strong><span>13.00 DECK</span></li>
               </ul>


               <h4>4. Estimated daily earning</h4>
               <ul className="voteList">
                   <li>0.00 ~ 0.00 DECK / 1day</li>
                   <li>0.00 ~ 0.00 dollor($) / 1day</li>
               </ul>

               <h4>5. Enter the number of votes to commit</h4>
               <div className="deckInput">
                   <CustomInput
                     labelText="DECK"
                     error
                     id="DECK"
                     formControlProps={{
                       fullWidth: true
                     }}
                     inputProps={{
                       type: "text"
                     }}


                   />
               </div>

               <p className="notiTxt">Note: The token used for voting can be withdrawn after 40 days.</p>

               <div>
                   <Button sz="large" color="rose" fullWidth>Commit</Button>
               </div>


               <h3>See also</h3>
               <div className="cardSide">
                   <a href="#">
                       <span className="img">
                           <img src="https://cdn.namuwikiusercontent.com/s/c57155e34a23c4f9918e0e6e5f14924223aa3f15c78049539ee0ed4edd00eb00a429933b1228c370105dc861e72b0a79160ba74677b9f6f7a94c303cbdadf04482c375c5defbfa244dcbcb3a42d55e73?e=1546994084&k=W8a-YTwBcvw2CetlHaNR3A" alt=""/>
                       </span>
                      <div className="inner">
                           <div className="tit"
                               style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                               >25 Uses for Duct Tape on Your Next Camping Trip</div>
                           <div className="descript"
                               style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                            >설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.</div>
                           <div className="badge">
                               <Badge color="rose">1,222 Deck</Badge>
                               <Badge color="rose">1,222 view</Badge>
                           </div>
                       </div>
                   </a>
               </div>

               <div className="cardSide">
                   <a href="#">
                       <span className="img">
                           <img src="https://dispatch.cdnser.be/wp-content/uploads/2017/01/20170105232912_lhj_1778.jpg" alt=""/>
                       </span>
                      <div className="inner">
                           <div className="tit"
                               style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                               >25 Uses for Duct Tape on Your Next Camping Trip</div>
                           <div className="descript"
                               style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                            >설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.설명 자리 입니다.</div>
                           <div className="badge">
                               <Badge color="rose">1,222 Deck</Badge>
                               <Badge color="rose">1,222 view</Badge>
                           </div>
                       </div>
                   </a>
               </div>

           </div>


        </div>
    );
  }
}

export default withStyles(style)(ContentView);
