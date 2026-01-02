const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  // Use the deployed VotingContract address (ensure this matches your latest deployment)
  // Previously this script pointed at the AuthManager address which caused selector mismatch errors.
  const contract = await hre.ethers.getContractAt("VotingContract", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
  console.log("Organizer:", await contract.getOrganizer());
}

main().catch(console.error);
