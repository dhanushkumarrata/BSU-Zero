pragma solidity ^0.4.18;

contract WhoToken {

  struct tokenHolder {
    address holderAddress;
    uint tokensBought;
    uint tokensUsed;
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

  function spendTokens(uint entryInTokens) public {
    uint availableTokens = holderInfo[msg.sender].tokensBought - holderInfo[msg.sender].tokensUsed;
    require(availableTokens >= entryInTokens);

    holderInfo[msg.sender].tokensUsed += entryInTokens;
  }

  function checkBalance() view public returns (uint) {
      uint tokenBalance = holderInfo[msg.sender].tokensBought - holderInfo[msg.sender].tokensUsed;
      return tokenBalance;
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

  function holderDetails(address user) view public returns (uint, uint) {
    return (holderInfo[user].tokensBought, holderInfo[user].tokensUsed);
  }

  function transferTo(address account) public {
    account.transfer(this.balance);
  }

}
