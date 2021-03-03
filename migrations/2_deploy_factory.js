const factoryContract = artifacts.require("UniswapV2Factory");

module.exports = async function (deployer) {
	// get the owner address
	const accounts = await web3.eth.getAccounts();
	const owner = accounts[0];

	// TODO
	const feeToSetterAddr = owner;

	// deploy factory contract
	await deployer.deploy(factoryContract, feeToSetterAddr);
};
