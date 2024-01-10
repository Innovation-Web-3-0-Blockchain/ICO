// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";

// Contract definition for the ICO (Initial Coin Offering)
contract Ico {
    // State variables
    address public owner;          // Address of the contract owner
    Token public token;            // Token contract being used in the ICO
    uint256 public price;          // Price of one token in wei
    uint256 public maxTokens;      // Maximum number of tokens available in the ICO
    uint256 public tokensSold;     // Total number of tokens sold in the ICO

    // Events to track key activities
    event Buy(uint256 amount, address buyer);
    event Finalize(uint256 tokensSold, uint256 ethRaised);

    // Constructor function to initialize the ICO contract
    constructor(Token _token, uint256 _price, uint256 _maxTokens) {
        owner = msg.sender;         // Set the contract deployer as the owner
        token = _token;             // Set the token contract
        price = _price;             // Set the initial token price
        maxTokens = _maxTokens;     // Set the maximum number of tokens available for sale
    }

    // Modifier to ensure that only the owner can execute certain functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    // Fallback function to allow purchasing tokens by sending Ether directly to the contract
    receive() external payable {
        uint256 amount = msg.value / price;        // Calculate the number of tokens to be bought
        buyTokens(amount * 1e18);                  // Buy tokens with the calculated amount
    }

    // Function to buy tokens with Ether
    function buyTokens(uint256 _amount) public payable {
        require(msg.value == (_amount / 1e18) * price, "Incorrect Ether value sent");  // Ensure correct Ether value sent
        require(token.balanceOf(address(this)) >= _amount, "Insufficient tokens available"); // Check token availability
        require(token.transfer(msg.sender, _amount), "Token transfer failed");           // Transfer tokens to the buyer

        tokensSold += _amount;    // Update total tokens sold

        emit Buy(_amount, msg.sender);  // Emit Buy event to log the purchase
    }

    // Function to set a new token price (only callable by the owner)
    function setPrice(uint256 _price) public onlyOwner {
        price = _price;  // Update the token price
    }

    // Function to finalize the ICO sale (only callable by the owner)
    function finalize() public onlyOwner {
        require(token.transfer(owner, token.balanceOf(address(this))), "Token transfer failed");  // Transfer remaining tokens to the owner

        uint256 value = address(this).balance;  // Get the contract's Ether balance
        (bool sent, ) = owner.call{value: value}("");  // Transfer Ether balance to the owner
        require(sent, "Ether transfer failed");  // Ensure Ether transfer is successful

        emit Finalize(tokensSold, value);  // Emit Finalize event to log the end of the ICO
    }
}