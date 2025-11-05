// Usage:
// 1) Set variables inline and run:
//    npx hardhat run scripts/transfer-ownership.js --network localhost
// 2) Or provide via env vars:
//    NEW_OWNER=0x... CONTRACT_ADDRESS=0x... npx hardhat run scripts/transfer-ownership.js --network localhost
// 3) Or pass new owner as first arg:
//    npx hardhat run scripts/transfer-ownership.js --network localhost -- 0xNEWOWNER

async function main() {
  const args = process.argv.slice(2);
  // after -- when using npx hardhat run, the extra args appear after the script args array
  const extraArgIndex = args.indexOf('--');
  let newOwnerArg = null;
  if (extraArgIndex !== -1 && args.length > extraArgIndex + 1) {
    newOwnerArg = args[extraArgIndex + 1];
  }

  const newOwner = process.env.NEW_OWNER || newOwnerArg;
  const contractAddress = process.env.CONTRACT_ADDRESS || process.env.VOTING_CONTRACT_ADDRESS;

  if (!newOwner) {
    console.error('Please provide NEW_OWNER via env var or as the first arg after --');
    process.exit(1);
  }
  if (!contractAddress) {
    console.error('Please set CONTRACT_ADDRESS or VOTING_CONTRACT_ADDRESS env var to the deployed contract address');
    process.exit(1);
  }

  const [signer] = await ethers.getSigners();
  console.log('Using signer:', signer.address);
  console.log('Target contract:', contractAddress);
  console.log('Transferring ownership to:', newOwner);

  const Voting = await ethers.getContractFactory('VotingContract');
  const voting = Voting.attach(contractAddress).connect(signer);

  const tx = await voting.transferOwnership(newOwner);
  console.log('Tx sent:', tx.hash);
  await tx.wait();
  console.log('Ownership transferred.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
