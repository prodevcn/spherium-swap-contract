const mulicallContract = artifacts.require("Multicall");

// Note: This migration is for testing purposes only and should never be used on mainnet!

module.exports = async function (deployer) {
	await deployer.deploy(mulicallContract);
};
