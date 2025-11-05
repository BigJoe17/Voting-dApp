const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  
  console.log("Checking deployment at:", contractAddress);
  
  const VotingContract = await ethers.getContractAt("Create", contractAddress);
  
  try {
    const organizer = await VotingContract.votingOrganizer();
    console.log("✅ Contract is deployed!");
    console.log("📋 Organizer address:", organizer);
    
    const candidateCount = await VotingContract.getCandidateLength();
    console.log("👥 Number of candidates:", candidateCount.toString());
    
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
