pragma solidity ^0.4.24;

import "./Deck.sol";
import "./Utility.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract AuthorPool is Ownable {

  event _InitializeAuthorPool(uint timestamp, address token);
  event _RegisterNewUserDocument(bytes32 indexed docId, uint timestamp, address indexed applicant, uint count);

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

  function init(address _token, address _utility) public
    onlyOwner()
  {

    require(_token != 0 && address(token) == 0);
    require(_utility != 0 && address(util) == 0);

    token = Deck(_token);
    util = Utility(_utility);

    createTime = util.getTimeMillis();
    emit _InitializeAuthorPool(createTime, _token);
  }

  // -------------------------------
  // For iteration
  // -------------------------------

  // author list for iteration
  function getAuthors() public view returns (address[]) {
    return keys;
  }

  // -------------------------------
  // User Document Functions
  // -------------------------------

  // register a new document
  function registerUserDocument(bytes32 _docId, address _author) public
    onlyOwner()
  {
    require(getIndex(_docId, _author) < 0);

    // adding to document registry
    uint tMillis = util.getDateMillis();
    if (map[_author].length == 0){
      keys.push(_author);
    }
    uint index = map[_author].push(Asset(_docId, tMillis, 0));

    emit _RegisterNewUserDocument(_docId, tMillis, _author, index);
  }

  function containsUserDocument(address _addr, bytes32 _docId) public view returns (bool) {
    return getIndex(_docId, _addr) >= 0;
  }

  function getUserDocumentIndex(address _addr, bytes32 _docId) public view returns (int) {
    return getIndex(_docId, _addr);
  }

  function getUserDocumentListedDate(address _addr, int _idx) public view returns (uint) {
    return map[_addr][uint(_idx)].listedDate;
  }

  function getUserDocumentLastClaimedDate(address _addr, int _idx) public view returns (uint) {
    return map[_addr][uint(_idx)].lastClaimedDate;
  }

  function determineReward(uint _pv, uint _tpv) public view returns (uint) {
    if (_tpv == 0 || _pv == 0) {
      return uint(0);
    }

    uint drp = util.getDailyRewardPool(uint(70), createTime);
    return uint(_pv * uint(drp / _tpv));
  }

  function getIndex(bytes32 _docId, address _author) private view returns (int) {
    Asset[] storage assetList = map[_author];
    if (assetList.length > 0) {
      for (int i=0; uint(i)<assetList.length; i++) {
        if (assetList[uint(i)].docId == _docId) {
          return i;
        }
      }
    }
    return -1;
  }

}
