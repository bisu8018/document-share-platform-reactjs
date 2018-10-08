pragma solidity ^0.4.24;

import "./Deck.sol";
import "./Utility.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract DocumentReg is Ownable{

  event _Initialize(uint timestamp, address token);
  event _RegisterNewDocument(bytes32 indexed docId, uint timestamp, address indexed applicant, uint count);
  event _ConfirmPageView(bytes32 indexed docId, uint timestamp, uint pageView);
  event _ConfirmTotalPageView(uint timestamp, uint pageView);

  struct Document {
    address author;
    uint createTime;
    mapping (uint => uint) pageViews; // date => page views
  }

  // maps document id to associated document data
  mapping (bytes32 => Document) internal map;

  // key list for iteration
  bytes32[] private docList;

  // store total page views for reward calculation
  //  : timestamp(yyyy-mm-dd) => daily total page view
  mapping (uint => uint) private totalPageViews;

  // private variables
  Utility private util;
  Deck private token;
  //AuthorPool private authorPool;
  //CuratorPool private curatorPool;

  // public variables
  uint public createTime;

  function init(address _token, address _author, address _curator, address _utility) public {

    require(_token != 0 && address(token) == 0);
    //require(_author != 0 && address(authorPool) == 0);
    //require(_curator != 0 && address(curatorPool) == 0);
    require(_utility != 0 && address(util) == 0);

    token = Deck(_token);
    util = Utility(_utility);

    createTime = util.getTimeMillis();
    emit _Initialize(createTime, _token);
  }

  // -------------------------------
  // Document Registry Functions
  // -------------------------------

  // register a new document
  function register(bytes32 _docId) public {

    require(map[_docId].createTime == 0); // register once

    uint tMillis = util.getDateMillis();

    // adding to document registry
    map[_docId] = Document(msg.sender, tMillis);
    uint index = docList.push(_docId);

    // creating user document mapping
    // userDocuments[msg.sender].push(_docId);

    emit _RegisterNewDocument(_docId, tMillis, msg.sender, 0);
  }

  function contains(bytes32 _docId) public view returns (bool) {
    return map[_docId].createTime != 0;
  }

  function getAuthorByKey(bytes32 _docId) public view returns (address) {
    require(map[_docId].createTime != 0);
    return map[_docId].author;
  }

  function getCreateTimeByKey(bytes32 _docId) public view returns (uint) {
    require(map[_docId].createTime != 0);
    return map[_docId].createTime;
  }

  function getDailyPageViewByKey(bytes32 _docId, uint date) public view returns (uint) {
    require(map[_docId].createTime != 0);
    require(map[_docId].pageViews[date] != 0);
    return map[_docId].pageViews[date];
  }

  function count() public view returns (uint) {
    return uint(docList.length);
  }

  // document list for iteration
  function getDocuments() public view returns (bytes32[]) {
    return docList;
  }

  // -------------------------------
  // Total Page View Functions
  // -------------------------------

  function confirmTotalPageView(uint _date, uint _totalPageView) public
    onlyOwner()
  {
    require(_date != 0);
    require(_totalPageView != 0);
    totalPageViews[_date] = _totalPageView;
    emit _ConfirmTotalPageView(_date, _totalPageView);
  }

  function getTotalPageView(uint _date) public view returns (uint) {
    require(_date != 0);
    return totalPageViews[_date];
  }

  // -------------------------------
  // Daily Page View Functions
  // -------------------------------

  function confirmPageView(bytes32 _docId, uint _date, uint _pageView) public
    onlyOwner()
  {
    require(map[_docId].createTime != 0);
    Document storage doc = map[_docId];
    doc.pageViews[_date] = _pageView;
    emit _ConfirmPageView(_docId, _date, _pageView);
  }

  function getPageView(bytes32 _docId, uint _date) external view returns (uint) {
    require(map[_docId].createTime != 0);
    return map[_docId].pageViews[_date];
  }

}
