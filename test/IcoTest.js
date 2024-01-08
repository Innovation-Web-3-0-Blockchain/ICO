const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
	return etehrs.utils.parseUnits(n.toString(), 'ether')
}

describe('Ico', () => {
	let ico

	beforeEach(async () => {
		const Ico = await ethers.getContractFactory('Ico')
		ico = await Ico.deploy()

	})

	describe('Deployment', () => {
		it('has correct name', async () => {
			expect(await ico.name()).to.eq("Ico")
		})
	})
})
