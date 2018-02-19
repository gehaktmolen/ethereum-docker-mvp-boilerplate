pragma solidity ^0.4.18;

contract Sample {
  string public name;
  bytes32[4] public choices;
  uint public choiceCount = 0;
  mapping(bytes32 => uint) public votesPerChoice;

  event LogChoiceMade(address indexed voter, bytes32 indexed choiceName, uint choiceVoteCount);

  function Sample(string _name, bytes32[4] _choices) public {
    name = _name;
    choices = _choices;
    choiceCount = _choices.length;
  }

  function vote(bytes32 _choice) public payable {
    votesPerChoice[_choice]++;
    LogChoiceMade(msg.sender, _choice, votesPerChoice[_choice]);
  }
}
