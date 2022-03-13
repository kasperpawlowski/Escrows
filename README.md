# Escrows

The following repository showcases implementation of Escrow dApp for three different blockchains - Polkadot, Solana and Algorand.


# Steps to run:
Clone the repository:
```
git clone https://github.com/kasperpawlowski/Escrows.git
cd Escrows
```

## Polkadot (Moonbase Alpha)
The Polkadot based Escrow dApp is based on Moonbase Alpha test network. To run it one can use already deployed smart contract or deploy it on their own. In either case one must set up the Metamask wallet and obtain test DEV tokens of Moonbase Alpha network.

Metamask network settings:
- Network Name:​ Moonbase Alpha
- New RPC URL: https://rpc.testnet.moonbeam.network
- ChainID: 1287
- Symbol (Optional): DEV

The test tokens can be obtained from a faucet located on the following Discort server:
```
https://discord.gg/K959bUYxYn
```
Look for `moonbase-faucet` channel and use the following command:
```
!faucet send <paste your address here>
```

# Smart contract deployment
To deploy the smart contract on your own, execute the following commands. If want to use the existing smart contract skip this step.
```
cd Polkadot/hardhat
npm install
mv .env.example .env
```

Provide you private key in the `.env` file. The account must have test tokens on its balance. Then execute:
```
npx hardhat run scripts/deploy.js --network moonbase
```

When done, in the console one can find the address under which the smart contract has been deployed. Copy it and replace with the existing address assigned to the `CONTRACT_ADDRESS` constant in `Escrows/Polkadot/frontend/src/components/Trade.js`

If any changes have been made to the smart contract interface, one has to update the `Escrows/Polkadot/frontend/src/abi/Escrow.json` with up to date ABI.


# Run frontend
To run the frontend app execute the following commands:
```
cd Polkadot/frontend
npm install
npm start
```

Open your browser and go to the following link to use the dApp:
```
http://localhost:3000/
```

There are three roles within the dApp:
- escrow owner - the account used to deploy the contract
- buyer - the account transferring funds to the escrow
- seller - the account designated by the buyer when transferring the funds

The dApp responds to the connected account change so that it always shows the UI related to the connected account's role. Possible actions based on the role:
- escrow owner - can mediate and send funds to either buyer or seller if they disagree
- buyer - after funds are sent to the escrow contract, can only release funds to the seller
- seller - can only refund buyer