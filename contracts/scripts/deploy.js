async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy AuthManager first
  console.log("\nDeploying AuthManager...");
  const AuthManager = await ethers.getContractFactory("AuthManager");
  const authManager = await AuthManager.deploy();
  await authManager.waitForDeployment();
  
  const authAddress = await authManager.getAddress();
  console.log("AuthManager deployed to:", authAddress);
  console.log("Copy this address to your frontend .env.local as NEXT_PUBLIC_AUTH_CONTRACT_ADDRESS");

  // Then deploy VotingContract
  console.log("\nDeploying VotingContract...");
  const VotingContract = await ethers.getContractFactory("VotingContract");
  const votingContract = await VotingContract.deploy();
  await votingContract.waitForDeployment();

  const votingAddress = await votingContract.getAddress();
  console.log("VotingContract deployed to:", votingAddress);
  console.log("Copy this address to your frontend .env.local as NEXT_PUBLIC_CONTRACT_ADDRESS");

  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log("AuthManager:    ", authAddress);
  console.log("VotingContract: ", votingAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
