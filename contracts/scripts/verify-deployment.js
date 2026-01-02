const { ethers } = require("hardhat");

async function main() {
  // Use your actual deployed contract address from localhost
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  console.log("🔍 Checking deployment at:", contractAddress);

  // Make sure the contract name matches your Solidity contract name exactly
  const VotingContract = await ethers.getContractAt("VotingContract", contractAddress);

  try {
    const organizer = await VotingContract.getOrganizer();
    console.log("✅ Contract is deployed!");
    console.log("📋 Organizer address:", organizer);

    const candidateCount = await VotingContract.getCandidateIds();
    console.log("👥 Candidate IDs:", candidateCount);

  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("\n💡 This might mean:");
    console.log("  1. The contract is not deployed to this address");
    console.log("  2. You're connected to the wrong network");
    console.log("  3. The Hardhat node was restarted and contracts were reset");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
