pragma solidity ^0.4.24;

import "./Deck.sol";
import "./Utility.sol";

contract AuthorPool {

  event _Initialize(uint timestamp, address token);
  event _RegisterNewDocument(bytes32 indexed docId, uint timestamp, address indexed applicant, uint count);

  struct Asset {
    bytes32 docId;
    uint listedDate;
    uint lastClaimedDate;
  }

  // maps address to the user's asset data
  mapping (address => Asset[]) internal map;

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
    emit _Initialize(createTime, _token);
  }

  // -------------------------------
  // Document Registry Functions
  // -------------------------------

  // register a new document
  function register(bytes32 _docId) public {

    require(getIndex(_docId, msg.sender) < 0);

    // adding to document registry
    uint tMillis = util.getDateMillis();
    uint index = map[msg.sender].push(Asset(_docId, tMillis, 0));
    keys.push(msg.sender);

    emit _RegisterNewDocument(_docId, tMillis, msg.sender, index);
  }

  function contains(bytes32 _docId) public view returns (bool) {
    return getIndex(_docId, msg.sender) >= 0;
  }

  function getAssetIndex(bytes32 _docId) public view returns (int) {
    return getIndex(_docId, msg.sender);
  }

  function getListedDate(int _idx) public view returns (uint) {
    return map[msg.sender][uint(_idx)].listedDate;
  }

  function getLastClaimedDate(int _idx) public view returns (uint) {
    return map[msg.sender][uint(_idx)].lastClaimedDate;
  }

  function count() public view returns (uint) {
    return uint(keys.length);
  }

  // document list for iteration
  function getAuthors() public view returns (address[]) {
    return keys;
  }

  function determineDeco(int _idx, uint _dateMillis, uint _pv, uint _tpvs) public view returns (uint) {

    require(_dateMillis > 0);
    require(_idx >= 0);
    require(_tpvs > 0);
    require(_pv > 0);

    uint drp = getDailyRewardPool();
    uint deco_with_ratio = 1000 * 1000 * 0.7;
    require(drp > 0);

    return uint(((_pv ** 2) * drp * deco_with_ratio) / _tpvs);
  }

  function getIndex(bytes32 _docId, address author) private view returns (int) {
    Asset[] storage assetList = map[author];
    if (assetList.length > 0) {
      for (int i=0; uint(i)<assetList.length; i++) {
        if (assetList[uint(i)].docId == _docId) {
          return i;
        }
      }
    }
    return -1;
  }

  function getDailyRewardPool() private view returns (uint) {
    require(createTime > 0);
    uint offsetYears = util.getOffsetYears(createTime);
    return 300 * (1 / (2 ** offsetYears));
  }

}
