pragma solidity ^0.4.24;

import "./Deck.sol";
import "./Utility.sol";

contract CuratorPool is Ownable {

  event _InitializeCuratorPool(uint timestamp, address token);
  event _AddVote(bytes32 indexed docId, uint timestamp, uint deposit, address indexed applicant, uint idx);
  event _Withdraw(address indexed applicant, uint idx, uint withdraw);
  //event _DetermineDeco(bytes32 indexed docId, uint cvd, uint tvd, uint pv, uint tpvs, uint drp);

  struct Vote {
    bytes32 docId;
    uint startDate;
    uint deposit;
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

  function init(address _token, address _utility) public
    onlyOwner()
  {
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
  function addVote(address _curator, bytes32 _docId, uint _deposit) public
    onlyOwner()
  {
    uint tMillis = util.getDateMillis();
    Vote memory vote = Vote(_docId, tMillis, _deposit, 0);

    uint idx = mapByAddr[_curator].push(vote);
    mapByDoc[_docId].push(vote);

    if (idx == 1) {
      keys.push(_curator);
    }

    emit _AddVote(_docId, tMillis, _deposit, _curator, idx);
  }

  function withdraw(address _curator, uint _idx, uint _withdraw) public
    onlyOwner()
  {
    mapByAddr[_curator][_idx].withdraw = _withdraw;
    emit _Withdraw(_curator, _idx, _withdraw);
  }

  function getVoteCount(address _addr) public view returns (uint) {
    return uint(mapByAddr[_addr].length);
  }

  function getDocId(address _addr, uint _idx) public view returns (bytes32) {
    return mapByAddr[_addr][uint(_idx)].docId;
  }

  function getStartDate(address _addr, uint _idx) public view returns (uint) {
    return mapByAddr[_addr][uint(_idx)].startDate;
  }

  function getDeposit(address _addr, uint _idx) public view returns (uint) {
    return mapByAddr[_addr][uint(_idx)].deposit;
  }

  function getWithdraw(address _addr, uint _idx) public view returns (uint) {
    return mapByAddr[_addr][uint(_idx)].withdraw;
  }

  // --------------------------------
  // 특정 큐레이터가 명시된 문서에 투표한 vote 중에서 인출 가능한 항목을 찾아서 목록을 리턴하기
  // --------------------------------
  function indexOfNextVoteForClaim(address _addr, bytes32 _docId, uint _index) public view returns (int) {

    if (mapByAddr[_addr].length == 0) {
      return int(-1);
    }

    if (mapByDoc[_docId].length == 0) {
      return int(-1);
    }

    // 1. 해당 큐레이터의 전체 vote 목록을 돌면서
    //  a. 명시된 docuemnt에 대한 vote만 필터링
    //  b. 이미 인출한 Vote 인지 검사
    //  c. 시작한지 30일이 지났는지 검사 (인출 가능한지)
    uint dateMillis = util.getDateMillis();
    for (uint i=(_index+1); i<mapByAddr[_addr].length; i++) {
      if ((mapByAddr[_addr][i].docId == _docId)
       && (mapByAddr[_addr][i].withdraw == 0)
       && (dateMillis > mapByAddr[_addr][i].startDate)
       && (dateMillis - mapByAddr[_addr][i].startDate > 30 * util.getOneDayMillis())) {
         return int(i);
      }
    }
    return -1;
  }

  function determineDeco(address _addr, uint _idx, uint _dateMillis, uint _pv, uint _tpvs) public view returns (uint) {

    require(_addr != 0);
    require(_dateMillis > 0);
    require(_tpvs > 0);
    require(_pv > 0);

    Vote memory vote = mapByAddr[_addr][_idx];

    if (vote.startDate > _dateMillis || vote.withdraw > 0) {
      return uint(0);
    }

    uint tvd = 0;
    Vote[] memory voteTotalList = mapByDoc[vote.docId];
    for (uint i=0; i<voteTotalList.length; i++) {
      uint tmpStartDate = voteTotalList[i].startDate;
      if (tmpStartDate - _dateMillis >= 0
        && tmpStartDate - _dateMillis < 30) {
        tvd += voteTotalList[i].deposit;
      }
    }

    uint drp = getDailyRewardDeco();
    if (drp == 0 || tvd == 0 || vote.deposit == 0) {
      return uint(0);
    }

    //emit _DetermineDeco(vote.docId, vote.deposit, tvd, _pv, _tpvs, drp);

    return (((drp * (_pv ** 2)) / _tpvs) / tvd) * vote.deposit;
  }

  function getDailyRewardDeco() private view returns (uint) {
    require(createTime > 0);
    uint offsetYears = util.getOffsetYears(createTime);
    uint initialTokens = 300;
    uint ratioDeco = 300 * 1000; // 30%
    return initialTokens * ratioDeco * (1 / (2 ** offsetYears));
  }

}
