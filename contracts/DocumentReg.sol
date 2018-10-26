pragma solidity ^0.4.24;

import "./Deck.sol";
import "./Utility.sol";
import "./AuthorPool.sol";
import "./CuratorPool.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract DocumentReg is Ownable {

  event _InitializeDocumentReg(uint timestamp, address token);
  event _RegisterNewDocument(bytes32 indexed docId, uint timestamp, address indexed applicant, uint count);
  event _UpdateDocument(bytes32 indexed docId, uint timestamp, address indexed applicant);
  event _ConfirmPageView(bytes32 indexed docId, uint timestamp, uint pageView);
  event _ConfirmTotalPageView(uint timestamp, uint pageView, uint pageViewSquare);
  event _VoteOnDocument(bytes32 indexed docId, uint deposit, address indexed applicant);
  event _UpdateVoteOnDocument(bytes32 indexed docId, uint deposit, address indexed applicant, uint timestamp);
  event _ClaimAuthorReward(bytes32 indexed docId, uint reward, address indexed applicant);
  event _ClaimCuratorReward(bytes32 indexed docId, uint reward, address indexed applicant);
  //event _DetermineReward(bytes32 indexed docId, uint timestamp, uint pageView, uint totalPageView, uint dailyReward);

  struct Document {
    address author;
    uint createTime;
    mapping (uint => uint) pageViews; // date => page views
  }

  // maps document id to associated document data
  mapping (bytes32 => Document) internal map;

  // key list for iteration
  bytes32[] private docList;

  // store total page view square for reward calculation
  //  : timestamp(yyyy-mm-dd) => daily total page view square
  mapping (uint => uint) private totalPageView;
  mapping (uint => uint) private totalPageViewSquare;

  // private variables
  Deck private token;
  Utility private util;
  AuthorPool private authorPool;
  CuratorPool private curatorPool;

  // public variables
  uint public createTime;

  function init(address _token, address _author, address _curator, address _utility) public
    onlyOwner()
  {

    require(_token != 0 && address(token) == 0);
    require(_author != 0 && address(authorPool) == 0);
    require(_curator != 0 && address(curatorPool) == 0);
    require(_utility != 0 && address(util) == 0);

    token = Deck(_token);
    util = Utility(_utility);

    // init author pool
    authorPool = AuthorPool(_author);
    authorPool.init(token, util);

    // init curator pool
    curatorPool = CuratorPool(_curator);
    curatorPool.init(token, util);

    createTime = util.getTimeMillis();
    emit _InitializeDocumentReg(createTime, _token);
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
    authorPool.registerUserDocument(_docId, msg.sender);
    assert(authorPool.containsUserDocument(msg.sender, _docId));

    emit _RegisterNewDocument(_docId, tMillis, msg.sender, index);
  }

  function update(address _addr, bytes32 _docId, uint _timestamp) public
    onlyOwner()
  {
    // updating to document registry
    if (map[_docId].createTime == 0) {
      docList.push(_docId);
    }
    map[_docId] = Document(_addr, _timestamp);

    // creating user document mapping
    authorPool.updateUserDocument(_docId, _addr, _timestamp);

    emit _UpdateDocument(_docId, _timestamp, _addr);
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

  function count() public view returns (uint) {
    return uint(docList.length);
  }

  // document list for iteration
  function getDocuments() public view returns (bytes32[]) {
    return docList;
  }

  // -------------------------------
  // Total Page View Square Functions
  // -------------------------------
/*
  function confirmTotalPageView(uint _date, uint _totalPageView, uint _totalPageViewSquare) public
    onlyOwner()
  {
    require(_date != 0);
    require(_totalPageView != 0);
    require(_totalPageViewSquare != 0);
    totalPageView[_date] = _totalPageView;
    totalPageViewSquare[_date] = _totalPageViewSquare;
    emit _ConfirmTotalPageView(_date, _totalPageView, _totalPageViewSquare);
  }
*/
  function getTotalPageView(uint _date) public view returns (uint) {
    require(_date != 0);
    return totalPageView[_date];
  }

  function getTotalPageViewSquare(uint _date) public view returns (uint) {
    require(_date != 0);
    return totalPageViewSquare[_date];
  }

  // -------------------------------
  // Daily Page View Functions
  // -------------------------------

  function confirmPageView(bytes32 _docId, uint _date, uint _pageView) public
    onlyOwner()
  {
    require(map[_docId].createTime != 0);

    Document storage doc = map[_docId];

    if (doc.pageViews[_date] > 0) {
      totalPageView[_date] -= doc.pageViews[_date];
      totalPageViewSquare[_date] -= (doc.pageViews[_date] ** 2);

      emit _ConfirmTotalPageView(_date, totalPageView[_date], totalPageViewSquare[_date]);
    }

    doc.pageViews[_date] = _pageView;
    totalPageView[_date] += _pageView;
    totalPageViewSquare[_date] += (_pageView ** 2);

    emit _ConfirmPageView(_docId, _date, _pageView);
    emit _ConfirmTotalPageView(_date, totalPageView[_date], totalPageViewSquare[_date]);
  }

  function getPageView(bytes32 _docId, uint _date) public view returns (uint) {
    require(map[_docId].createTime != 0);
    return map[_docId].pageViews[_date];
  }

  // -------------------------------
  // Determine author reward after last claim
  // -------------------------------

  function determineAuthorReward(address _addr, bytes32 _docId) public view returns (uint) {

    require(_addr != 0);
    require(authorPool.createTime() != 0);
    int idx = authorPool.getUserDocumentIndex(_addr, _docId);
    if (idx < 0) {
      return uint(0);
    }

    uint sumReward = 0;
    uint claimDate = authorPool.getUserDocumentLastClaimedDate(_addr, uint(idx));
    while (claimDate < util.getDateMillis()) {
      if (claimDate == 0) {
        claimDate = authorPool.getUserDocumentListedDate(_addr, uint(idx));
      }
      //assert(claimDate <= util.getDateMillis());
      uint tpv = getTotalPageView(claimDate);
      uint pv = getPageView(_docId, claimDate);
      sumReward += authorPool.determineReward(pv, tpv);

      uint nextDate = claimDate + util.getOneDayMillis();
      assert(claimDate < nextDate);
      claimDate = nextDate;
      //emit _DetermineReward(_docId, lastClaimedDate, pv, tpv, dailyRewardPool);
    }
    return sumReward;
  }

  function claimAuthorReward(bytes32 _docId) public {
    require(msg.sender != 0);
    require(authorPool.createTime() != 0);
    int idx = authorPool.getUserDocumentIndex(msg.sender, _docId);
    if (idx < 0) {
      return;
    }

    emit _ClaimAuthorReward(_docId, uint(idx), msg.sender);
    uint claimDate = authorPool.getUserDocumentLastClaimedDate(msg.sender, uint(idx));
    emit _ClaimAuthorReward(_docId, claimDate, msg.sender);
    uint dateMillis = util.getDateMillis();

    uint sumReward = 0;
    while (claimDate < dateMillis) {
      if (claimDate == 0) {
        claimDate = authorPool.getUserDocumentListedDate(msg.sender, uint(idx));
      }
      assert(claimDate <= dateMillis);

      uint tpv = getTotalPageView(claimDate);
      uint pv = getPageView(_docId, claimDate);
      sumReward += authorPool.determineReward(pv, tpv);

      uint nextDate = claimDate + util.getOneDayMillis();
      assert(nextDate > claimDate);
      claimDate = nextDate;
    }

    token.transfer(msg.sender, sumReward);
    authorPool.withdraw(msg.sender, uint(idx), sumReward, claimDate);

    emit _ClaimAuthorReward(_docId, sumReward, msg.sender);
  }

  // -------------------------------
  // Estimate curator reward after last claim
  // -------------------------------

  function estimateCuratorReward(address _addr, bytes32 _docId) public view returns (uint) {

    require(_addr != 0);
    require(curatorPool.createTime() != 0);

    uint numVotes = curatorPool.getVoteCount(_addr);
    if (numVotes == 0) {
      return uint(0);
    }

    uint reward = 0;
    for (uint i=0; i<numVotes; i++) {
      if (curatorPool.getDocId(_addr, i) == _docId
       && curatorPool.getWithdraw(_addr, i) == 0) {
        uint dt = curatorPool.getStartDate(_addr, i);
        for (uint j=0; j<util.getVoteDepositDays(); j++) {
          uint pv = getPageView(_docId, dt);
          uint tpvs = getTotalPageViewSquare(dt);
          reward += curatorPool.determineReward(_addr, i, dt, pv, tpvs);
          dt += util.getOneDayMillis();
        }
      }
    }
    return reward;
  }

  // -------------------------------
  // Determine curator reward after last claim
  // -------------------------------
  function determineCuratorReward(bytes32 _docId) public view returns (uint) {

    // validation check
    require(curatorPool.createTime() != 0);

    uint numVotes = 0;
    int idx = curatorPool.indexOfNextVoteForClaim(msg.sender, _docId, uint(0));
    while(idx >= 0)
    {
      numVotes++;
      idx = curatorPool.indexOfNextVoteForClaim(msg.sender, _docId, uint(idx));
    }

    uint reward = 0;
    idx = curatorPool.indexOfNextVoteForClaim(msg.sender, _docId, uint(0));
    for(uint i=0; i<numVotes; i++)
    {
      uint dt = curatorPool.getStartDate(msg.sender, uint(idx));
      for (uint j=0; j<util.getVoteDepositDays(); j++) {
        uint pv = getPageView(_docId, dt);
        uint tpvs = getTotalPageViewSquare(dt);
        reward += curatorPool.determineReward(msg.sender, uint(idx), dt, pv, tpvs);
        dt += util.getOneDayMillis();
      }
      idx = curatorPool.indexOfNextVoteForClaim(msg.sender, _docId, uint(idx));
    }

    return reward;
  }

  function claimCuratorReward(bytes32 _docId) public {

    // validation check
    require(curatorPool.createTime() != 0);

    // 1. Going around the full vote list of the curator
    //  a. Select only the votes for the specified docuemnt
    //  b. Exclude votes that have already been withdrawn
    //  c. Check whether voting period expired since start date (can be claimed)
    uint numVotes = 0;
    int idx = curatorPool.indexOfNextVoteForClaim(msg.sender, _docId, uint(0));
    while(idx >= 0)
    {
      numVotes++;
      idx = curatorPool.indexOfNextVoteForClaim(msg.sender, _docId, uint(idx));
    }
    if (numVotes == 0) {
      return;
    }

    // 2. Calculate total reward based on the list from step #1
    //  a. The token amount is based on 18 decimals by default
    //  b. Calculate daily reward by page views ​​from start date for deposit days
    //  c. Determine the final amount of the sum of the daily compensation and deposit
    uint reward = 0;
    uint[] memory voteList = new uint[](numVotes);
    uint[] memory deltaList = new uint[](numVotes);
    idx = curatorPool.indexOfNextVoteForClaim(msg.sender, _docId, uint(0));
    for(uint i=0; i<numVotes; i++)
    {
      uint delta = 0;
      uint dt = curatorPool.getStartDate(msg.sender, uint(idx));
      for (uint j=0; j<util.getVoteDepositDays(); j++) {
        uint pv = getPageView(_docId, dt);
        uint tpvs = getTotalPageViewSquare(dt);
        delta += curatorPool.determineReward(msg.sender, uint(idx), dt, pv, tpvs);
        dt += util.getOneDayMillis();
      }
      reward += delta;
      reward += curatorPool.getDeposit(msg.sender, uint(idx));
      voteList[i] = uint(idx);
      deltaList[i] = delta;
      idx = curatorPool.indexOfNextVoteForClaim(msg.sender, _docId, uint(idx));
    }

    // 3. Transfer the determined reward from the this contract to the user account
    token.transfer(msg.sender, reward);


    // 4. Record the amount of reward in the withdrawn votes
    for (i=0; i<voteList.length; i++) {
      curatorPool.withdraw(msg.sender, voteList[i], deltaList[i]);
    }

    emit _ClaimCuratorReward(_docId, reward, msg.sender);
  }

  // -------------------------------
  // Voting for curators
  // -------------------------------
  function voteOnDocument(bytes32 _docId, uint _deposit) public {

    require(_deposit > 0);
    require(curatorPool.createTime() != 0);

    token.transferFrom(msg.sender, address(this), _deposit);
    curatorPool.addVote(msg.sender, _docId, _deposit);

    emit _VoteOnDocument(_docId, _deposit, msg.sender);
  }

  function updateVoteOnDocument(address _addr, bytes32 _docId, uint _deposit, uint _timestamp) public
    onlyOwner()
  {
    require(_deposit > 0);
    require(curatorPool.createTime() != 0);

    curatorPool.updateVote(_addr, _docId, _deposit, _timestamp);
    emit _UpdateVoteOnDocument(_docId, _deposit, _addr, _timestamp);
  }

  // -------------------------------
  // Query functions
  // -------------------------------

  function getCuratorDepositOnUserDocument(address _addr, bytes32 _docId, uint _timestamp) public view returns (uint) {
    return curatorPool.getDepositByAddr(_addr, _docId, _timestamp);
  }

  function getCuratorDepositOnDocument(bytes32 _docId, uint _timestamp) public view returns (uint) {
    return curatorPool.getDepositByDoc(_docId, _timestamp);
  }

  function getCuratorWithdrawOnUserDocument(address _addr, bytes32 _docId, uint _timestamp) public view returns (uint) {
    return curatorPool.getWithdrawByAddr(_addr, _docId, _timestamp);
  }

  function getCuratorWithdrawOnDocument(bytes32 _docId, uint _timestamp) public view returns (uint) {
    return curatorPool.getWithdrawByDoc(_docId, _timestamp);
  }

  function getAuthorWithdrawOnUserDocument(address _addr, bytes32 _docId) public view returns (uint) {
    return authorPool.getUserDocumentWithdraw(_addr, _docId);
  }

}
