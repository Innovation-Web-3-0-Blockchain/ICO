// Import necessary libraries
const { expect } = require('chai');
const { ethers } = require('hardhat');

// Function to convert a numerical value to token units
const tokens = (n) => ethers.utils.parseUnits(n.toString(), 'ether');

// Alias for the 'tokens' function as 'ether'
const ether = tokens;

// Main test suite for the ICO contract
describe('Ico', () => {
  let token, ico; // Declare variables for the token and ICO contract
  let deployer, user1, user2, user3;  // Declare variables for deployer and user accounts

  // Before each test case, deploy the Token and ICO contracts and perform necessary setup
  beforeEach(async () => {
    const Ico = await ethers.getContractFactory('Ico');
    const Token = await ethers.getContractFactory('Token');

    // Deploy the Token contract
    token = await Token.deploy('Canada DigitalAssets Exchange', 'CADEX', '1000000');

    // Get account information
    [deployer, user1, user2] = await ethers.getSigners();

    // Deploy the ICO contract, and transfer tokens to ICO address
    ico = await Ico.deploy(token.address, ether(1), '1000000');

    const transaction = await token.connect(deployer).transfer(ico.address, tokens(1000000));
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

  // Test suite for whitelist sale
  describe('Whitelist Sale', () => {
    it('owner add user to whitelist ', async () => {
      await ico.connect(deployer).addToWhitelist(user1.address);
    });

    it('owner start whitelist sale', async () => {
      await ico.connect(deployer).startWhitelistSale();
    });

    // Check if the 'AddToWhitelist' event is emitted with the correct arguments
    it('emits startWhitelistSale event', async () => {
      await expect(ico.startWhitelistSale()).to.emit(ico, "WhitelistSaleStarted");
    });

    // Check if the 'AddToWhitelist' event is emitted with the correct arguments
    it('emits AddToWhitelist event', async () => {
      await expect(ico.addToWhitelist(user1.address)).to.emit(ico, "AddToWhitelist").withArgs(user1.address);
    });
  });

  // Test suite for sending ETH to the contract
  describe('Sending ETH', () => {
    let transaction, result;
    let amount = ether(10);

    // Sub-suite for successful sending of ETH to the contract
    describe('Success', () => {
      // Before each test case, add the user to the whitelist and send ETH from user1 to the ICO contract with a specified gas limit
      beforeEach(async () => {
        await ico.connect(deployer).startWhitelistSale(); // Activate whitelist sale
        await ico.connect(deployer).addToWhitelist(user1.address); // Add user1 to the whitelist
        transaction = await user1.sendTransaction({ to: ico.address, value: amount, gasLimit: 2000000 });
        result = await transaction.wait();
      });

      // Add check for whitelist user send ETH to ICO contract

      // Check if the contract's ETH balance is updated correctly
      it('updates contracts ether balance', async () => {
        expect(await ethers.provider.getBalance(ico.address)).to.equal(amount);
      });

      // Check if the user's token balance is updated correctly
      it('updates user token balance', async () => {
        expect(await token.balanceOf(user1.address)).to.equal(amount);

      // Add failure case for user not having enough ETH to send to contract

      // Add failure case for non-white listed user trying to send eth to the ICO contract

      });
    });
  });

  // Sub-suite for buying tokens during whitelist sale
  describe('Buying Tokens During Whitelist Sale', () => {
    let transaction, result;
    let amount = tokens(10);

    // Before each test case, start the whitelist sale and add a user to the whitelist
    beforeEach(async () => {
      await ico.connect(deployer).startWhitelistSale();
      await ico.connect(deployer).addToWhitelist(user1.address);
    });

    // Sub-sub-suite for successful buying of tokens during whitelist sale
    describe('Success', () => {
      // Before each test case, perform a token purchase by a whitelisted user
      beforeEach(async () => {
        transaction = await ico.connect(user1).buyTokens(amount, { value: ether(10) });
        result = await transaction.wait();
      });

      // Add check for whitelisted user buying ico tokens

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
        await expect(transaction).to.emit(ico, "Buy").withArgs(amount, user1.address);
      });
    });

    // Sub-sub-suite for failed buying of tokens during whitelist sale (non-whitelisted user)
    describe('Failure', () => {
      // Check if non-whitelisted user is prevented from buying tokens
      it('prevents non-whitelisted user from buying tokens', async () => {
        // Update the expected revert reason to match the actual revert reason
        await expect(ico.connect(user2).buyTokens(tokens(10), { value: ether(10) })).to.be.revertedWith("User Not Whitelisted");
      });
    });
  });

  // Test suite for updating the ICO price
  describe('Updating Price', () => {
    let transaction, result;
    let price = ether(2);

    // Sub-suite for successful price update
    describe('Success', () => {
      // Before each test case, update the ICO price
      beforeEach(async () => {
        transaction = await ico.connect(deployer).setPrice(ether(2));
        result = await transaction.wait();
      });

      // Check if the price is updated correctly
      it('updates the price', async () => {
        expect(await ico.price()).to.equal(ether(2));
      });
    });

    // Sub-suite for failed price update (non-owner trying to update)
    describe('Failure', () => {
      // Check if non-owner is prevented from updating the price
      it('prevents non-owner from updating price', async () => {
        await expect(ico.connect(user1).setPrice(price)).to.be.reverted;
      });
    });
  });

  // Test suite for finalizing the sale
  describe('Finalizing Sale', () => {
    let transaction, result;
    let amount = tokens(10);
    let value = ether(10);

    // Sub-suite for successful sale finalization
    describe('Success', () => {
      // Before each test case, buy tokens and then finalize the sale
      beforeEach(async () => {
        // Add user1 to the whitelist
        await ico.connect(deployer).addToWhitelist(user1.address);
        await ico.connect(deployer).startWhitelistSale();

        transaction = await ico.connect(user1).buyTokens(amount, { value: value });
        result = await transaction.wait();

        transaction = await ico.connect(deployer).finalize();
        result = await transaction.wait();
      });

      // Check if remaining tokens are transferred to the owner
      it('transfers remaining tokens to owner', async () => {
        expect(await token.balanceOf(ico.address)).to.equal(0);
        expect(await token.balanceOf(deployer.address)).to.equal(tokens(999990));
      });

      // Check if the ETH balance in ICO contract is transferred to the owner
      it('transfers ETH balance to owner', async () => {
        expect(await ethers.provider.getBalance(ico.address)).to.equal(0);
      });

      // Check if the 'Finalize' event is emitted with the correct arguments
      it('emits Finalize event', async () => {
        await expect(transaction).to.emit(ico, "Finalize").withArgs(amount, value);
      });
    });

    // Sub-suite for failed sale finalization (non-owner trying to finalize)
    describe('Failure', () => {
      // Check if non-owner is prevented from finalizing the sale
      it('prevents non-owner from finalizing', async () => {
        await expect(ico.connect(user1).finalize()).to.be.reverted;
      });
    });
  });
});
