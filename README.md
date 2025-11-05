# VotingDApp — Fullstack On-chain Voting MVP

An advanced decentralized voting application with Solidity smart contracts (Hardhat + OpenZeppelin) and a Next.js frontend using wagmi + RainbowKit + TailwindCSS.

## 🎯 Features

- ✅ On-chain proposals and votes
- ✅ Admin can create proposals and control voting lifecycle
- ✅ One vote per address per proposal
- ✅ Live UI updates using contract events
- ✅ Secure wallet connection via RainbowKit
- ✅ Automatic ABI synchronization between contracts and frontend

## 📁 Project Structure

```
VotingDApp/
├── contracts/          # Hardhat smart contract project
│   ├── contracts/      # Solidity contracts
│   ├── scripts/        # Deploy & utility scripts
│   ├── test/          # Contract tests
│   └── package.json
├── frontend/          # Next.js frontend
│   ├── pages/         # Next.js pages
│   ├── components/    # React components
│   ├── abis/          # Contract ABIs
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### 1. Smart Contracts

```powershell
cd .\contracts
npm install
npx hardhat compile    # This also copies the ABI to frontend
npx hardhat test
```

### 2. Deploy to Sepolia

Create `contracts/.env` from `.env.example`:
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_ID
DEPLOYER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
```

Deploy:
```powershell
npx hardhat run scripts\deploy.js --network sepolia
```

Copy the deployed contract address.

### 3. Frontend Setup

```powershell
cd ..\frontend
npm install
```

Create `frontend/.env.local`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

Run:
```powershell
npm run dev
```

Open http://localhost:3000

## 🔧 Development Workflow

### After Updating the Contract

1. Compile contract (auto-copies ABI):
   ```powershell
   cd contracts
   npm run compile
   ```

2. Or manually copy ABI:
   ```powershell
   npm run copy-abi
   ```

### Testing Contracts

```powershell
cd contracts
npx hardhat test
```

### Local Blockchain Testing

```powershell
# Terminal 1 - Start local node
npx hardhat node

# Terminal 2 - Deploy to local
npx hardhat run scripts\deploy.js --network localhost

# Use the local contract address in frontend/.env.local
```

## 📝 Contract Functions

### Owner Functions
- `addProposal(string name)` - Create a new proposal
- `startVoting()` - Enable voting
- `endVoting()` - Disable voting

### Public Functions
- `vote(uint256 proposalId)` - Vote for a proposal
- `getProposals()` - Get all proposals and vote counts
- `proposalsCount()` - Get total number of proposals

### Events
- `ProposalAdded(uint256 proposalId, string name)`
- `Voted(address voter, uint256 proposalId)`
- `VotingStarted()`
- `VotingEnded()`

## 🌐 Deployment to Production

### Vercel (Recommended for Frontend)
1. Push to GitHub
2. Import project in Vercel
3. Set environment variable: `NEXT_PUBLIC_CONTRACT_ADDRESS`
4. Deploy

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Environment variable: `NEXT_PUBLIC_CONTRACT_ADDRESS`

## 🔮 Future Enhancements

- [ ] **The Graph Integration** - Index events for historical queries
- [ ] **Anonymous Voting** - Integrate Semaphore or ZK-SNARKs
- [ ] **Token-Gated Voting** - Only token/NFT holders can vote
- [ ] **Weighted Voting** - DAO-style voting based on token balance
- [ ] **Delegation** - Allow users to delegate voting power
- [ ] **Multiple Choice Proposals** - More than yes/no voting
- [ ] **Time-Limited Proposals** - Auto-start/end based on block time
- [ ] **Admin Dashboard** - Better proposal management UI

## 📚 Tech Stack

### Backend
- Solidity ^0.8.18
- Hardhat
- OpenZeppelin Contracts
- Chai (testing)

### Frontend
- Next.js 13
- React 18
- wagmi (Ethereum hooks)
- RainbowKit (wallet connection)
- ethers.js v6
- TailwindCSS

## 🛠️ Troubleshooting

### ABI not found error
Run `npm run copy-abi` in contracts folder to sync ABI to frontend.

### Contract not deployed
Check that `NEXT_PUBLIC_CONTRACT_ADDRESS` is set correctly in `frontend/.env.local`.

### Transaction failing
Ensure:
1. Voting is active (owner must call `startVoting()`)
2. You haven't voted for this proposal already
3. You're connected to the correct network (Sepolia)

### MetaMask network issues
Make sure MetaMask is connected to Sepolia testnet.

## 📄 License

MIT
