pragma solidity ^0.4.24;

contract Utility {

  uint private ONE_DAY_MILLIS = 86400000;

  function bytes32ToStr(bytes32 _bytes32) private pure returns (string) {
    bytes memory bytesArray = new bytes(32);
    for (uint256 i; i < 32; i++) {
      bytesArray[i] = _bytes32[i];
    }
    return string(bytesArray);
  }

  function getTimeMillis() public view returns (uint) {
    return block.timestamp * 1000;
  }

  function getDateMillis() public view returns (uint) {
    uint tDay = block.timestamp / (ONE_DAY_MILLIS / 1000);
    uint tMillis = tDay * ONE_DAY_MILLIS;
    return tMillis;
  }

}
