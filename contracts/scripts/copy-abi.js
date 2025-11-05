const fs = require('fs');
const path = require('path');

async function main() {
  const contractName = 'VotingContract';
  
  // Path to compiled artifact
  const artifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', `${contractName}.sol`, 'Create.json');
  
  // Path to frontend ABI folder
  const frontendAbiPath = path.join(__dirname, '..', '..', 'frontend', 'abis', `${contractName}.json`);
  
  if (!fs.existsSync(artifactPath)) {
    console.error(`❌ Artifact not found at ${artifactPath}`);
    console.error('Please run "npx hardhat compile" first.');
    process.exit(1);
  }

  // Read the full artifact
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  
  // Extract just the ABI
  const abi = artifact.abi;
  
  // Ensure frontend/abis directory exists
  const frontendAbiDir = path.dirname(frontendAbiPath);
  if (!fs.existsSync(frontendAbiDir)) {
    fs.mkdirSync(frontendAbiDir, { recursive: true });
  }
  
  // Write ABI to frontend
  fs.writeFileSync(frontendAbiPath, JSON.stringify(abi, null, 2));
  
  console.log(`✅ ABI copied to ${frontendAbiPath}`);
  console.log(`📄 Contract: ${contractName}`);
  console.log(`🔧 Functions: ${abi.filter(x => x.type === 'function').length}`);
  console.log(`📡 Events: ${abi.filter(x => x.type === 'event').length}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
