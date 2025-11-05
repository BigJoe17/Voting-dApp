require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    compilers: [{ version: "0.8.20" }]
  },
  networks: {
    hardhat: {
      chainId: 1337  // Add this to match MetaMask
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,  // Match MetaMask
      accounts: {
        mnemonic: "test test test test test test test test test test test junk"
      }
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : []
    }
  }
};