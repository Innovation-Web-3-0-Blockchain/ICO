// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";

// Contract definition for the ICO (Initial Coin Offering)
contract Ico {
    // State variables
    Token public token;            // Token contract being used in the ICO
    uint256 public price;          // Price of one token in wei
    uint256 public maxTokens;      // Maximum number of tokens available in the ICO
    uint256 public tokensSold;     // Total number of tokens sold in the ICO

    // Events to track key activities
    event Buy(uint256 amount, address buyer);

    // Constructor function to initialize the ICO contract
    constructor(Token _token, uint256 _price, uint256 _maxTokens) {
        token = _token;             // Set the token contract
        price = _price;             // Set the initial token price
        maxTokens = _maxTokens;     // Set the maximum number of tokens available for sale
    }

    // Function to buy tokens with Ether
    function buyTokens(uint256 _amount) public payable {
        require(msg.value == (_amount / 1e18) * price, "Incorrect Ether value sent");  // Ensure correct Ether value sent
        require(token.balanceOf(address(this)) >= _amount, "Insufficient tokens available"); // Check token availability
        require(token.transfer(msg.sender, _amount), "Token transfer failed");           // Transfer tokens to the buyer

        tokensSold += _amount;    // Update total tokens sold

        emit Buy(_amount, msg.sender);  // Emit Buy event to log the purchase
    }
}
