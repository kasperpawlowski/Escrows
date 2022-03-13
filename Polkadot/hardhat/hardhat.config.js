require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

module.exports = {
  solidity: "0.8.12",
  networks: {
    moonbase: {
      url: 'https://rpc.api.moonbase.moonbeam.network',
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
