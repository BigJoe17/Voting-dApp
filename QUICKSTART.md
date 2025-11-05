# VotingDApp Quick Start Commands

## Complete Setup (Run these in order)

### 1. Install Contract Dependencies
cd contracts
npm install

### 2. Compile Contracts  
npx hardhat compile

### 3. Run Tests (Optional)
npx hardhat test

### 4. Start Hardhat Node (Keep this terminal open)
npx hardhat node

### 5. Deploy Contracts (Open NEW terminal)
cd contracts
npx hardhat run scripts/deploy.js --network localhost

### 6. Note the deployed addresses:
# AuthManager:     0x5FbDB2315678afecb367f032d93F642f64180aa3
# VotingContract:  0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

### 7. Install Frontend Dependencies
cd frontend
npm install

### 8. Start Frontend (in another terminal)
cd frontend
npm run dev

### 9. Open Browser
# Go to: http://localhost:3000

## MetaMask Setup
# 1. Add Localhost Network:
#    - Network Name: Localhost 8545
#    - RPC URL: http://127.0.0.1:8545
#    - Chain ID: 1337
#    - Currency: ETH
#
# 2. Import Admin Account:
#    Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
#
# 3. Switch to Localhost network
#
# 4. Go to http://localhost:3000/login
#    Username: admin
#    Password: admin
