pragma solidity ^0.4.24;

import "./Deck.sol";
import "./Utility.sol";

contract CuratorPool {

  event _InitializeCuratorPool(uint timestamp, address token);
  event _AddVote(bytes32 indexed docId, uint timestamp, uint deposit, address indexed applicant, uint idx);
  //event _DetermineDeco(bytes32 indexed docId, uint cvd, uint tvd, uint pv, uint tpvs, uint drp);

  struct Vote {
    bytes32 docId;
    uint startDate;
    uint deposit;
    uint deco;
    uint withdraw;
  }

  // maps address to the curator's vote data
  mapping (address => Vote[]) internal mapByAddr;

  // maps docId to the curator's vote data
  mapping (bytes32 => Vote[]) internal mapByDoc;

  // key list for iteration
  address[] private keys;

  // private variables
  Utility private util;
  Deck private token;

  // public variables
  uint public createTime;

  function init(address _token, address _utility) public {

    require(_token != 0 && address(token) == 0);
    require(_utility != 0 && address(util) == 0);

    token = Deck(_token);
    util = Utility(_utility);

    createTime = util.getTimeMillis();
    emit _InitializeCuratorPool(createTime, _token);
  }

  // -------------------------------
  // For iteration
  // -------------------------------

  // curator list for iteration
  function getCurators() public view returns (address[]) {
    return keys;
  }

  // -------------------------------
  // Voting Information Functions
  // -------------------------------

  // adding a new vote
  function addVote(address _curator, bytes32 _docId, uint _deposit) public {

    uint tMillis = util.getDateMillis();
    Vote memory vote = Vote(_docId, tMillis, _deposit, 0, 0);

    uint idx = mapByAddr[_curator].push(vote);
    mapByDoc[_docId].push(vote);

    if (idx == 1) {
      keys.push(_curator);
    }

    emit _AddVote(_docId, tMillis, _deposit, _curator, idx);
  }

  function getVoteCount(address _addr) public view returns (uint) {
    return uint(mapByAddr[_addr].length);
  }

  function getDocId(address _addr, int _idx) public view returns (bytes32) {
    return mapByAddr[_addr][uint(_idx)].docId;
  }

  function getStartDate(address _addr, int _idx) public view returns (uint) {
    return mapByAddr[_addr][uint(_idx)].startDate;
  }

  function getDeposit(address _addr, int _idx) public view returns (uint) {
    return mapByAddr[_addr][uint(_idx)].deposit;
  }

  function getWithdraw(address _addr, int _idx) public view returns (uint) {
    return mapByAddr[_addr][uint(_idx)].withdraw;
  }

  function determineDeco(address _addr, int _idx, uint _dateMillis, uint _pv, uint _tpvs) public view returns (uint) {

    require(_addr != 0);
    require(_dateMillis > 0);
    require(_idx >= 0);
    require(_tpvs > 0);
    require(_pv > 0);

    uint tvd = 0;
    uint cvd = mapByAddr[_addr][uint(_idx)].deposit;
    bytes32 docId = mapByAddr[_addr][uint(_idx)].docId;

    Vote[] memory voteList = mapByDoc[docId];
    for (uint i=0; i<voteList.length; i++) {
      tvd += voteList[i].deposit;
    }

    uint drp = getDailyRewardDeco();

    if (drp == 0 || tvd == 0 || cvd == 0) {
      return uint(0);
    }

    //emit _DetermineDeco(docId, cvd, tvd, _pv, _tpvs, drp);

    return (((drp * (_pv ** 2)) / _tpvs) / tvd) * cvd;
  }

  function getDailyRewardDeco() private view returns (uint) {
    require(createTime > 0);
    uint offsetYears = util.getOffsetYears(createTime);
    uint initialTokens = 300;
    uint ratioDeco = 300 * 1000; // 30%
    return initialTokens * ratioDeco * (1 / (2 ** offsetYears));
  }

}
