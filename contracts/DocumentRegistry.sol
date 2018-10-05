pragma solidity ^0.4.24;

contract DocumentRegistry {

  event _RegisterNewDocument(bytes32 indexed docId, uint timestamp, address indexed applicant);
  event _ConfirmPageView(bytes32 indexed docId, uint timestamp, uint pageView);
  //event _GetRewardAmount(bytes32 indexed docId, uint timestamp, uint lastClaimed, uint dailyReward, uint sumReward);

  struct Document {
    address owner;
    uint timestamp;
    uint claimedDate;
    mapping (uint => uint) dailyPageViews; // timestamp => page views
  }

  // whole document registry
  mapping (bytes32 => Document) private documentRegistry;

  // user to document mappings
  mapping (address => bytes32[]) private userDocuments;

  // store total page views for reward calculation
  //  : timestamp(yyyy-mm-dd) => daily total page view
  mapping (uint => uint) private totalPageViews;

  uint private ONE_DAY_MILLIS = 86400000;
  uint private createDate;
  uint private initialDailyRewardPool;
  address private foundation;

  function init(uint _timestamp, uint _rewardPool) public {
    require(msg.sender != 0 && address(foundation) == 0);
    foundation = msg.sender;
    createDate = _timestamp;
    initialDailyRewardPool = _rewardPool;
  }

  function isInitialized() external view returns (bool) {
    if(foundation == 0) return false;
    return true;
  }

  function registerDocument(bytes32 _docId) external {

    require(documentRegistry[_docId].timestamp == 0); // register once

    uint tDay = block.timestamp / (ONE_DAY_MILLIS / 1000);
    uint tMillis = tDay * ONE_DAY_MILLIS;

    // adding to document registry
    documentRegistry[_docId] = Document(msg.sender, tMillis, 0);
    // creating user document mapping
    userDocuments[msg.sender].push(_docId);

    emit _RegisterNewDocument(_docId, tMillis, msg.sender);
  }

  function getUserDocument(uint i) external view returns (string) {
    require(userDocuments[msg.sender].length > i); // check if exist
    return bytes32ToStr(userDocuments[msg.sender][i]);
  }

  function getUserDocumentsCount() external view returns (uint) {
    return userDocuments[msg.sender].length;
  }

  function isExist(bytes32 _docId) external view returns (bool) {
    if(documentRegistry[_docId].owner == 0) return false;
    return true;
  }

  function confirmPageView(bytes32 _docId, uint _timestamp, uint _pageView) external {
    require(foundation == msg.sender); // foundation only
    require(documentRegistry[_docId].timestamp != 0);
    Document storage document = documentRegistry[_docId];
    document.dailyPageViews[_timestamp] = _pageView;
    emit _ConfirmPageView(_docId, _timestamp, document.dailyPageViews[_timestamp]);
  }

  function getPageView(bytes32 _docId, uint _timestamp) external view returns (uint) {
    require(documentRegistry[_docId].owner != 0);
    require(documentRegistry[_docId].timestamp != 0);
    return documentRegistry[_docId].dailyPageViews[_timestamp];
  }

  function confirmTotalPageView(uint _timestamp, uint _totalPageView) external {
    require(foundation == msg.sender); // foundation only
    require(_timestamp != 0);
    totalPageViews[_timestamp] = _totalPageView;
  }

  function getTotalPageView(uint _timestamp) external view returns (uint) {
    require(_timestamp != 0);
    return totalPageViews[_timestamp];
  }

  function getRewardAmount(bytes32 _docId, uint _timestamp) external view returns (uint) {

    require(_timestamp != 0);
    require(documentRegistry[_docId].owner != 0);
    require(documentRegistry[_docId].timestamp != 0);

    uint lastClaimedDate = documentRegistry[_docId].claimedDate;
    uint drp = getDailyRewardPool();
    uint sumReward = 0;

    require(drp > 0);
    require(lastClaimedDate > 0);

    while (lastClaimedDate < _timestamp) {

      if (lastClaimedDate == 0) {
        lastClaimedDate = documentRegistry[_docId].timestamp;
      }

      uint tpv = totalPageViews[lastClaimedDate];
      uint pv = documentRegistry[_docId].dailyPageViews[lastClaimedDate];
      if (tpv > 0 && pv > 0) {
        sumReward = sumReward + (pv * drp * 700) / tpv;
      }

      require(lastClaimedDate < lastClaimedDate + ONE_DAY_MILLIS);
      lastClaimedDate = lastClaimedDate + ONE_DAY_MILLIS;
    }
    return sumReward;
  }

  /////////////////////////////////////////
  // UTILITY FUNCTIONS
  function bytes32ToStr(bytes32 _bytes32) private pure returns (string) {
    bytes memory bytesArray = new bytes(32);
    for (uint256 i; i < 32; i++) {
      bytesArray[i] = _bytes32[i];
    }
    return string(bytesArray);
  }

  function getDailyRewardPool() private view returns (uint) {
    uint curTimeSec = block.timestamp;
    uint createTimeSec = createDate / 1000;
    uint offsetSec = curTimeSec - createTimeSec;
    uint offsetDays = offsetSec / (ONE_DAY_MILLIS / 1000);
    uint offsetYears = offsetDays / 365;
    return initialDailyRewardPool * (1/2 ** offsetYears);
  }
}
