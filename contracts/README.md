# Smart Contracts - Voting DApp

Hardhat project with the Voting smart contract.

## Setup

```powershell
npm install
```

## Commands

### Compile
```powershell
npm run compile
# or
npx hardhat compile
```
This automatically copies the ABI to `frontend/abis/Voting.json`.

### Test
```powershell
npm test
# or
npx hardhat test
```

### Deploy to Sepolia

1. Create `.env` file:
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_ID
DEPLOYER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
```

2. Deploy:
```powershell
npx hardhat run scripts\deploy.js --network sepolia
```

3. Copy the deployed address to `frontend/.env.local`

### Copy ABI Only
```powershell
npm run copy-abi
```

## Contract: Voting.sol

### Architecture
- Inherits from OpenZeppelin's `Ownable`
- Stores proposals in an array
- Tracks votes per address per proposal
- Emits events for frontend integration

### Key Features
- ✅ Admin-only proposal creation
- ✅ Voting lifecycle control (start/end)
- ✅ One vote per address per proposal
- ✅ Event emissions for live UI updates
- ✅ Gas-efficient storage

### Security Considerations
- Owner controls proposal creation and voting lifecycle
- No vote modification after casting
- Reentrancy not a concern (no external calls)
- Uses `calldata` for gas optimization

## Testing

Tests cover:
- Proposal creation (owner-only)
- Voting lifecycle
- Single-vote enforcement
- Access control

Run with:
```powershell
npx hardhat test
```

## Local Development

Start a local Hardhat node:
```powershell
npx hardhat node
```

In another terminal, deploy to local network:
```powershell
npx hardhat run scripts\deploy.js --network localhost
```

## Gas Optimization Tips

- Use `calldata` for string parameters
- Minimal storage writes
- Efficient mapping structure
- Events for off-chain data

## Future Improvements

- Add proposal descriptions/metadata
- Time-based voting periods
- Quorum requirements
- Vote delegation
- Weighted voting by token balance
