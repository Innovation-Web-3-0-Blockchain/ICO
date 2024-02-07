// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";

contract ICO {
    // State variables
    address public owner;                    // Address of the contract owner
    Token public token;                      // Token contract being used in the ICO
    uint256 public whitelistSalePrice;       // Price of one token in wei for whitelist sale
    uint256 public publicSalePrice;          // Price of one token in wei for public sale
    uint256 public maxTokens;                // Maximum number of tokens available in the ICO
    uint256 public tokensSold;               // Total number of tokens sold in the ICO
    uint256 public whitelistSaleStartTime;   // Start time for the whitelist sale
    bool public isWhitelistSaleOpen;         // Status to track if whitelist sale is open
    uint256 public whitelistSaleEndTime;     // Timestamp for the end of the whitelist Sale period

    // Events to track key activities
    event Buy(uint256 amount, address buyer);
    event Finalize(uint256 tokensSold, uint256 ethRaised);
    event AddToWhitelist(address indexed account);
    event WhitelistSaleStarted();
    event WhitelistSaleClosed();  

    // Whitelist mapping to track addresses allowed to participate in the ICO
    mapping(address => bool) public whitelist;

    // Constructor function to initialize the ICO contract
    constructor(Token _token, uint256 _whitelistSalePrice, uint256 _maxTokens) {
        owner = msg.sender;            // Set the contract deployer as the owner
        token = _token;                // Set the token contract
        whitelistSalePrice = _whitelistSalePrice;    // Set the initial token price for whitelist sale
        maxTokens = _maxTokens;        // Set the maximum number of tokens available for sale
        isWhitelistSaleOpen = false;   // Set whitelist sale as closed initially
    }

    // Modifier to ensure that only the owner can execute certain functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    modifier onlyWhenWhitelistSaleOpen() {
        require(isWhitelistSaleOpen, "Whitelist sale is not open");
        _;
    }

    // Function to add an address to the whitelist (only callable by the owner)
    function addToWhitelist(address _address) public onlyOwner {
        whitelist[_address] = true;
        emit AddToWhitelist(_address);
    }

    // Function to start the whitelist sale (only callable by the owner, once)
    function startWhitelistSale() public onlyOwner {
        require(whitelistSaleStartTime == 0, "Whitelist sale already started");
        whitelistSaleStartTime = block.timestamp;
        // Set whitelist Sale period to one week from today
        whitelistSaleEndTime = block.timestamp + 1 weeks;
        isWhitelistSaleOpen = true;
        emit WhitelistSaleStarted();
    }

    // Function to close the whitelist sale (only callable by the owner)
    function closeWhitelistSale() public onlyOwner {
        require(isWhitelistSaleOpen, "Whitelist sale is not open");
        isWhitelistSaleOpen = false;
        emit WhitelistSaleClosed();
    }

  
    // Function to set a new token price for whitelist sale (only callable by the owner)
    function setWhitelistSalePrice(uint256 _whitelistSalePrice) public onlyOwner {
        whitelistSalePrice = _whitelistSalePrice;  // Update the token price for whitelist sale
    }

    function getWhitelistSaleDates() public view returns (uint256 startTime, uint256 endTime) {
        return (whitelistSaleStartTime, whitelistSaleEndTime);
    }


    // Function to check if whitelist sale is active
    function isWhitelistSaleActive() public view returns (bool) {
        return isWhitelistSaleOpen &&
               block.timestamp >= whitelistSaleStartTime &&
               block.timestamp < whitelistSaleEndTime;
    }

 // Function to buy tokens with Ether
function buyTokens(uint256 _amount) public payable onlyWhenWhitelistSaleOpen {
    require(whitelist[msg.sender], "User not allowed to participate");
    require(isWhitelistSaleActive(), "Whitelist sale is not active");

    uint256 tokenPrice = whitelistSalePrice;

    require(msg.value == (_amount / 1e18) * tokenPrice, "Incorrect Ether value sent");  // Ensure correct Ether value sent
    require(token.balanceOf(address(this)) >= _amount, "Insufficient tokens available"); // Check token availability
    require(token.transfer(msg.sender, _amount), "Token transfer failed");           // Transfer tokens to the buyer

    tokensSold += _amount;    // Update total tokens sold

    emit Buy(_amount, msg.sender);  // Emit Buy event to log the Sale
}

  // Fallback function to allow purchasing tokens by sending Ether directly to the contract
    receive() external payable onlyWhenWhitelistSaleOpen {
        require(msg.value > 0, "Ether value sent must be greater than 0");

        uint256 amount;

        if (isWhitelistSaleOpen) {
            require(whitelist[msg.sender], "User not allowed to participate in whitelist sale");
            require(block.timestamp <= whitelistSaleEndTime, "Whitelist sale has ended");
            amount = msg.value / whitelistSalePrice;
        } else {
            revert("Whitelist sale is not open");
        }

        buyTokens(amount * 1e18); // Buy tokens with the calculated amount
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
