// Import necessary libraries
const { expect } = require('chai');
const { ethers } = require('hardhat');

// Function to convert a numerical value to token units
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
};

// Alias for the 'tokens' function as 'ether'
const ether = tokens;

// Main test suite for the ICO contract
describe('Ico', () => {
  let token, ico; // Declare variables for the token and ICO contract
  let deployer, user1; // Declare variables for deployer and user1 accounts

  // Before each test case, deploy the Token and ICO contracts and perform necessary setup
  beforeEach(async () => {
    const Ico = await ethers.getContractFactory('Ico');
    const Token = await ethers.getContractFactory('Token');

    // Deploy the Token contract
    token = await Token.deploy('Canada DigitalAssets Exchange', 'CADEX', '1000000');

    // Get account information
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    user1 = accounts[1];

    // Deploy the ICO contract, and transfer tokens to ICO address
    ico = await Ico.deploy(token.address, ether(1), '1000000');

    let transaction = await token.connect(deployer).transfer(ico.address, tokens(1000000));
    await transaction.wait();
  });

  // Test case for deployment-related checks
  describe('Deployment', () => {

    // Check if tokens are sent to the ICO contract
    it('sends tokens to the ICO contract', async () => {
      expect(await token.balanceOf(ico.address)).to.equal(tokens(1000000));
    });

    // Check if the correct price is returned
    it('returns the price', async () => {
      expect(await ico.price()).to.equal(ether(1));
    });

    // Check if the correct token address is returned
    it('returns token address', async () => {
      expect(await ico.token()).to.equal(token.address);
    });

  });

  // Test suite for buying tokens
  describe('Buying Tokens', () => {
    let transaction, result;
    let amount = tokens(10);

    // Sub-suite for successful buying of tokens
    describe('Success', () => {

      // Before each test case, perform a token purchase by user1
      beforeEach(async () => {
        transaction = await ico.connect(user1).buyTokens(amount, { value: ether(10) });
        result = await transaction.wait();
      });

      // Check if tokens are transferred correctly
      it('transfers tokens', async () => {
        expect(await token.balanceOf(ico.address)).to.equal(tokens(999990));
        expect(await token.balanceOf(user1.address)).to.equal(amount);
      });

      // Check if 'tokensSold' is updated correctly
      it('updates tokensSold', async () => {
        expect(await ico.tokensSold()).to.equal(amount);
      });

      // Check if the 'Buy' event is emitted with the correct arguments
      it('emits a buy event', async () => {
        await expect(transaction).to.emit(ico, "Buy")
          .withArgs(amount, user1.address);
      });

    });

    // Sub-suite for failed buying of tokens (insufficient ETH)
    describe('Failure', () => {

      // Check if the contract rejects insufficient ETH
      it('rejects insufficient ETH', async () => {
        await expect(ico.connect(user1).buyTokens(tokens(10), { value: 0 })).to.be.reverted;
      });

    });

  });

  // Test suite for sending ETH to the contract
  describe('Sending ETH', () => {
    let transaction, result;
    let amount = ether(10);

    // Sub-suite for successful ETH sending
    describe('Success', () => {

      // Before each test case, send ETH from user1 to the ICO contract
      beforeEach(async () => {
        transaction = await user1.sendTransaction({ to: ico.address, value: amount });
        result = await transaction.wait();
      });

      // Check if the contract's ETH balance is updated correctly
      it('updates contracts ether balance', async () => {
        expect(await ethers.provider.getBalance(ico.address)).to.equal(amount);
      });

      // Check if the user's token balance is updated correctly
      it('updates user token balance', async () => {
        expect(await token.balanceOf(user1.address)).to.equal(amount);
      });
    });
  });
});
