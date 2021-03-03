const factoryContract = artifacts.require("UniswapV2Factory");
const routerContract = artifacts.require("UniswapV2Router02");
const mockTokenContract = artifacts.require("MockERC20");
const wETHContract = artifacts.require("WETH");

// Note: This migration is for testing purposes only and should never be used on mainnet!

module.exports = async function (deployer) {
	const accounts = await web3.eth.getAccounts();
	const owner = accounts[0];
	const supply = 10000000000000000000000000n; // 10M, 18 decimals

	let factory = await factoryContract.deployed();
	let router = await routerContract.deployed();

	// get current blocktime
	let block = await web3.eth.getBlock("latest");
	const deadline = block.timestamp + 1200; // should confirm within 20 mins (we are on test net anyhow)

	// contract address to ticker map
	var m = new Object();

	// deploy mock ERC20 contracts
	console.log("Creating Mock Tokens:")
	for (i = 1; i <= 8; i++) {
		const num = i.toString().padStart(2, "0")
		const name = `TOK${num} Mock Token`;
		const ticker = `TOK${num}`;

		// Note: we manage the deployment manually and avoid the truffle deployer as
		// the same contract is deployed multiple times
		let token = await mockTokenContract.new(name, ticker, supply.toString(), { from: owner });
		// await deployer.deploy(mockTokenContract, name, ticker, supply.toString(), { from: owner });
		// let token = await mockTokenContract.deployed();

		// send 20%/30% of supply to second/thrid address (just for convenience)
		// let token = await mockTokenContract.deployed();
		await token.transfer(accounts[1], (supply * 2n / 10n).toString(), { from: owner });
		await token.transfer(accounts[2], (supply * 3n / 10n).toString(), { from: owner });

		// store address
		m[ticker] = token.address
		console.log(ticker, token.address);

		// create allowance to be able to add liquidity to pairs
		await token.approve(router.address, supply.toString(), { from: owner })

		// create (WETH, X) pair, add liquidity
		// Note: it's not strickly needed to create the pair frist as the addLiquidity 
		// function would also take care of that
		await factory.createPair(wETHContract.address, token.address, { from: owner });
		// let pairAddress = await factory.getPair(wETHContract.address, token.address);

		// i * 74 TOK to 3 ETH
		// address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline
		await router.addLiquidityETH(token.address, (BigInt(i) * 74n * 10n ** 18n).toString(), "0", "0", owner, deadline, { from: owner, value: (3n * 10n ** 16n).toString() }); // 0.03 ETH
	}
	
	// create some more pairs
	await factory.createPair(m["TOK01"], m["TOK02"], { from: owner });
	// address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline
	await router.addLiquidity(m["TOK01"], m["TOK02"], (200n * 10n ** 18n).toString(), (72n * 10n ** 18n).toString(), "0", "0", owner, deadline, { from: owner });
	
	await factory.createPair(m["TOK01"], m["TOK03"]);
	await router.addLiquidity(m["TOK01"], m["TOK03"], (400n * 10n ** 18n).toString(), (150n * 10n ** 18n).toString(), "0", "0", owner, deadline, { from: owner });

	await factory.createPair(m["TOK04"], m["TOK05"]);
	await router.addLiquidity(m["TOK04"], m["TOK05"], (800n * 10n ** 18n).toString(), (5n * 10n ** 18n).toString(), "0", "0", owner, deadline, { from: owner });

	await factory.createPair(m["TOK04"], m["TOK07"]);
	await router.addLiquidity(m["TOK04"], m["TOK07"], (1000n * 10n ** 18n).toString(), (2n * 10n ** 18n).toString(), "0", "0", owner, deadline, { from: owner });
};
