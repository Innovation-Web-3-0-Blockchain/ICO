// Import the Hardhat Runtime Environment (HRE) module
const hre = require("hardhat");

// Main asynchronous function to deploy the Token and ICO contracts
async function main() {
  // Constants defining the token details
  const NAME = 'Canada DigitalAssets Exchange';
  const SYMBOL = 'CADEX';
  const MAX_SUPPLY = '1000000';
  const PRICE = ethers.utils.parseUnits('0.025', 'ether');

  // Deploy the Token contract
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy(NAME, SYMBOL, MAX_SUPPLY);
  await token.deployed();

  // Log the deployment address of the Token contract
  console.log(`Token deployed to: ${token.address}\n`);

  // Deploy the ICO contract, passing the Token contract address and other parameters
  const Ico = await hre.ethers.getContractFactory("Ico");
  const ico = await Ico.deploy(token.address, PRICE, ethers.utils.parseUnits(MAX_SUPPLY, 'ether'));
  await ico.deployed();

  // Log the deployment address of the ICO contract
  console.log(`Ico deployed to: ${ico.address}\n`);

  // Transfer tokens from the Token contract to the ICO contract
  const transferTransaction = await token.transfer(ico.address, ethers.utils.parseUnits(MAX_SUPPLY, 'ether'));
  await transferTransaction.wait();

  // Log that tokens have been transferred to the ICO
  console.log(`Tokens transferred to Ico\n`);;

  // Start the whitelist sale automatically in the ICO contract
  const startWhitelistSaleTransaction = await ico.startWhitelistSale();
  await startWhitelistSaleTransaction.wait();

  // Log that the whitelist sale has started
  console.log(`Whitelist sale started in Ico\n`);
}

// Execute the main function and handle any errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
