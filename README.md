This is a Dapp that is built using solidity, hardhat and ether and vite (react.js) on the frontend.

It does one simple thing. Send payment to ethereum address and save the transactions details which can be viewed another time.
Although at the moment, It is on testnet with eth-sepolia address.

In the solidity:
The transactionContract code has following functions: getTransactionCount getAllTransactions, addToBlockchain.

After deploying the smart contract with hardhat using the deploy.js script, I moved the ABI and contract address to Vite [React][frontend].

From then, I used ethers to interact with smart contract to query and send payment on the platform.

Here is the link to site.
Ethpay:

