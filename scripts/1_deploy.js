// Import the Hardhat Runtime Environment (HRE) module
const { ethers } = require("hardhat");

// Main asynchronous function to deploy the Token and ICO contracts
async function main() {
  try {
    // Constants defining the token details
    const NAME = 'Canada DigitalAssets Exchange';
    const SYMBOL = 'CADEX';
    const MAX_SUPPLY = '1000000';
    const WHITELIST_SALE_PRICE = ethers.utils.parseUnits('0.025', 'ether');

    // Deploy the Token contract
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy(NAME, SYMBOL, MAX_SUPPLY);
    await token.deployed();

    // Log the deployment address and details of the Token contract
    console.log('\n');
    console.log(`Token deployed to: ${token.address}`);

    // Deploy the ICO contract, passing the Token contract address and other parameters
    const Ico = await ethers.getContractFactory("ICO");
    const ico = await Ico.deploy(token.address, WHITELIST_SALE_PRICE, ethers.utils.parseUnits(MAX_SUPPLY, 'ether'));
    await ico.deployed();

    // Log the deployment address of the ICO contract
    console.log(`Ico deployed to: ${ico.address}`);
    console.log('\n');

    // Transfer tokens from the Token contract to the ICO contract
    const transferTransaction = await token.transfer(ico.address, ethers.utils.parseUnits(MAX_SUPPLY, 'ether'));
    await transferTransaction.wait();

    // Log that tokens have been transferred to the ICO
    console.log(`Tokens transferred to Ico\n`);

    // Add Account # 1 to the whitelist
    const addUserToWhitelist = await ico.addToWhitelist("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
    await addUserToWhitelist.wait();

    // Log that the address has been whitelisted
    console.log(`Account #1 whitelisted in Ico\n`);

    // Start the whitelist sale automatically in the ICO contract
    const startWhitelistSaleTransaction = await ico.startWhitelistSale();
    await startWhitelistSaleTransaction.wait();

    // Check if the whitelist sale is active
    const isWhitelistSaleActive = await ico.isWhitelistSaleActive();
    console.log(`Whitelist sale active: ${isWhitelistSaleActive}\n`);
    
    // Get the whitelist sale price
    const whitelistTokenPrice = await ico.whitelistSalePrice();
    console.log(`Whitelist sale price: ${ethers.utils.formatUnits(whitelistTokenPrice, 'ether')} ETH\n`);

    // Get the whitelist sale dates
    const whitelistSaleDates = await ico.getWhitelistSaleDates();

    // Format the dates using the Date object
    const startDate = new Date(whitelistSaleDates[0].toNumber() * 1000); // Multiply by 1000 to convert seconds to milliseconds
    const endDate = new Date(whitelistSaleDates[1].toNumber() * 1000); // Multiply by 1000 to convert seconds to milliseconds

    // Log the formatted dates and times
    console.log(`Whitelist starting date: ${startDate.toLocaleString()}`);
    console.log(`Whitelist ending date: ${endDate.toLocaleString()}`);

  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

// Execute the main function
main();
