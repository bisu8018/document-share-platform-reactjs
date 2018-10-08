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

  function getLastClaimedDate(bytes32 _docId) public view returns (uint) {
    int index = getIndex(_docId, msg.sender);
    require(index >= 0);
    return map[msg.sender][uint(index)].lastClaimedDate;
  }

  function count() public view returns (uint) {
    return uint(keys.length);
  }

  // document list for iteration
  function getDocuments() public view returns (address[]) {
    return keys;
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

}
