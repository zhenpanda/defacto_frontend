require("@nomiclabs/hardhat-waffle");
require('hardhat-abi-exporter');
require('dotenv').config();


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.7.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  abiExporter: {
    path: './data/abi',
    clear: true,
    flat: true,
    spacing: 2
  },
  networks: {
    kovan: {
      url: process.env.NODE_URL,
      accounts: {
        mnemonic: process.env.MNEMONIC
      }
    },
  }
};

