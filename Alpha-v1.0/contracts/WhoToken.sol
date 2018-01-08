pragma solidity ^0.4.18;

contract WhoToken {

  struct tokenHolder {
    address holderAddress;
    uint tokensBought;
    uint[] tokensUsedPerEntry;
  }

  mapping (address => tokenHolder) public holderInfo;

  uint public totalTokens;
  uint public balanceTokens;
  uint public tokenPrice;

  function WhoToken(uint tokens, uint pricePerToken) public {
    totalTokens = tokens;
    balanceTokens = tokens;
    tokenPrice = pricePerToken;
  }

  function spendTokens(uint votesInTokens) public {
    uint availableTokens = holderInfo[msg.sender].tokensBought - totalTokensUsed(holderInfo[msg.sender].tokensUsedPerEntry);
    require(availableTokens >= votesInTokens);

    holderInfo[msg.sender].tokensUsedPerEntry[index] += votesInTokens;
  }

  function totalTokensUsed(uint[] _tokensUsedPerEntry) private pure returns (uint) {
    uint totalUsedTokens = 0;
    for(uint i = 0; i < _tokensUsedPerEntry.length; i++) {
      totalUsedTokens += _tokensUsedPerEntry[i];
    }
    return totalUsedTokens;
  }

  function checkBalance() view public returns (uint) {
      uint balanceTokens = holderInfo[msg.sender].tokensBought - totalTokensUsed(holderInfo[msg.sender].tokensUsedPerEntry);
      return balanceTokens;
  }

  function buy() payable public returns (uint) {
    uint tokensToBuy = msg.value / tokenPrice;
    require(tokensToBuy <= balanceTokens);
    holderInfo[msg.sender].holderAddress = msg.sender;
    holderInfo[msg.sender].tokensBought += tokensToBuy;
    balanceTokens -= tokensToBuy;
    return tokensToBuy;
  }

  function tokensSold() view public returns (uint) {
    return totalTokens - balanceTokens;
  }

  function holderDetails(address user) view public returns (uint, uint[]) {
    return (holderInfo[user].tokensBought, holderInfo[user].tokensUsedPerEntry);
  }

  function transferTo(address account) public {
    account.transfer(this.balance);
  }

}
