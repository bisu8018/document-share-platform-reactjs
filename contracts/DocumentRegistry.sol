pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract DocumentRegistry {

  event _RegisterNewDocument(bytes32 indexed docId, address indexed applicant);
  event _ConfirmPageView(bytes32 indexed docId, uint timestamp, uint pageView);

  using SafeMath for uint;

  struct Document {
    uint timestamp;
    address owner;
    mapping (uint => uint) pageViews;
  }

  mapping (bytes32 => Document) public documentRegistry;

  // foundation info
  address public foundation;

  function init() public {
    require(msg.sender != 0 && address(foundation) == 0);
    foundation = msg.sender;
  }

  function registerDocument(bytes32 _docId) external {
    require(documentRegistry[_docId].timestamp == 0); // register only
    documentRegistry[_docId] = Document(block.timestamp, msg.sender);
    emit _RegisterNewDocument(_docId, msg.sender);
  }

  function isExist(bytes32 _docId) external view returns (bool) {
    if(documentRegistry[_docId].owner == 0) return false;
    return true;
  }

  function confirmPageView(bytes32 _docId, uint _timestamp, uint _pageView) external {
    require(foundation == msg.sender); // foundation only
    require(documentRegistry[_docId].timestamp != 0);
    Document storage document = documentRegistry[_docId];
    document.pageViews[_timestamp] = _pageView;
    emit _ConfirmPageView(_docId, _timestamp, document.pageViews[_timestamp]);
  }

  function getPageView(bytes32 _docId, uint _timestamp) external view returns (uint) {
    require(foundation == msg.sender); // foundation only
    require(documentRegistry[_docId].owner != 0);
    require(documentRegistry[_docId].timestamp != 0);
    return documentRegistry[_docId].pageViews[_timestamp];
  }

}
