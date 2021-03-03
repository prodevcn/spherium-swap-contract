const factoryContract = artifacts.require("UniswapV2Factory");
const routerContract = artifacts.require("UniswapV2Router02");
const wETHContract = artifacts.require("WETH");

module.exports = async function (deployer, _network, addresses) {
  let weth;

  //To differentiate environment
  if(_network === "mainnet") {
      //weth address on mainnet
    weth = await wETHContract.at("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
  } else {
    await deployer.deploy(wETHContract);
    weth = await wETHContract.deployed();

    // split it among first few accounts
    const accounts = await web3.eth.getAccounts();

    await weth.deposit({ from: accounts[0], value: 80000000000000000 }); // 0.08 ETH
    // await weth.deposit({ from: accounts[1], value: 100000000000000000 }); // 0.1 ETH
    // await weth.deposit({ from: accounts[2], value: 120000000000000000 }); // 0.12 ETH
  }

  await deployer.deploy(routerContract, factoryContract.address, weth.address);
};