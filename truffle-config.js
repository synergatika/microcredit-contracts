// const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = "dinner filter frozen verify mix alone mountain onion leisure physical tennis shuffle";

module.exports = {
  compilers: {
    solc: {
      settings: {
        evmVersion: "byzantium"
      }
    }
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    onlyCalledMethods: true,
    rst: true
  },
  networks: {
    development: {
      host: "192.168.88.246",
      // port: 8545,
      // gasPrice: 0,
      // network_id: "*" // Match any network id
      port: 22000, // was 8545
      network_id: "*", // Match any network id
      gasPrice: 0,
      gas: 10000000,
      type: "quorum" // needed for Truffle to support Quorum
    },
    production: {
      host: "95.216.92.152",
      port: 22000, // was 8545
      network_id: "*", // Match any network id
      gasPrice: 0,
      gas: 10000000,
      type: "quorum" // needed for Truffle to support Quorum
    }
  }
};