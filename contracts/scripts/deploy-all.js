const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);

  // Deploy AuthManager
  const AuthManager = await hre.ethers.getContractFactory("AuthManager");
  const authManager = await AuthManager.deploy();
  await authManager.waitForDeployment();

  const authManagerAddress = await authManager.getAddress();
  console.log("AuthManager deployed to:", authManagerAddress);
  console.log("Copy this address to your frontend .env.local as NEXT_PUBLIC_AUTH_CONTRACT_ADDRESS");

  // Deploy VotingContract (if not already deployed)
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const votingContract = await VotingContract.deploy();
  await votingContract.waitForDeployment();

  const votingContractAddress = await votingContract.getAddress();
  console.log("VotingContract deployed to:", votingContractAddress);
  console.log("Copy this address to your frontend .env.local as NEXT_PUBLIC_CONTRACT_ADDRESS");

  // Grant admin access in AuthManager to the VotingContract owner
  const tx = await authManager.setAdminStatus(deployer.address, true);
  await tx.wait();
  console.log("Admin access granted to:", deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });