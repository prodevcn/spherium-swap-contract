# Spherium Swap core contracts

The following assumes the use of `node@>=10`.

## Install Dependencies

`yarn`

## Compile Contracts (waffle)

`yarn compile`

## Deploy Contracts locally (truffle)

Create '.env' from the env.template in the root project directory (optionally create a free infura.io account).
Start your local ethereum chain.

`yarn ganache-cli --mnemonic "your 12 word seed phrase" --defaultBalanceEther 10000`

Deploy all contracts

`yarn deploy`

## Run Tests (waffle)

`yarn test`

## CREATE2 and Hash code 

The 'UniswapV2Factory.sol' contract relies on the CREATE2 opcode for deterministc pair address creation. 
In order to calculate the pair address without making any external calls, the keccak hash of the bytecode 
of the 'UniswapV2Pair.sol' has to be hard-coded into 'UniswapV2Library.sol'. Unfortunately, the bytecode 
of a contract heavly depends on the solc compiler settings and version. Make sure that correct hash code is 
written to 'UniswapV2Library.sol' before deploying to any non-local network. Run

`python3 verify_code_hash.py`

to help with the verification process.
