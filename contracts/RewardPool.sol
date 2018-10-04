pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract RewardPool {

  using SafeMath for uint;

  string public myString = "Hello World";
  uint public offset = 1;

  function set(string _x) public {
    myString = _x;
  }

  function setOffset(uint _offset) external {
    offset = _offset;
  }
}
