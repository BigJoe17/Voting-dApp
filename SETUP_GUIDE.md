# Complete Setup Guide for VotingDApp

## 📋 Prerequisites
- Node.js v18 or higher installed
- MetaMask browser extension installed
- Git installed (optional)

## 🚀 Complete Setup Instructions

### Step 1: Install Contract Dependencies
```powershell
cd contracts
npm install
```

### Step 2: Compile Contracts
```powershell
npx hardhat compile
```

This will:
- Compile both `VotingContract.sol` and `AuthManager.sol`
- Generate ABIs in `artifacts/` folder
- Copy ABIs to `frontend/abis/` automatically

### Step 3: Run Contract Tests (Optional but Recommended)
```powershell
npx hardhat test
```

### Step 4: Start Local Blockchain
Open a **NEW terminal** and run:
```powershell
cd contracts
npx hardhat node
```

⚠️ **Keep this terminal running!** It should show:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
```

### Step 5: Deploy Contracts to Local Network
Open **ANOTHER terminal** and run:
```powershell
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

You should see:
```
Deploying contracts with account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

Deploying AuthManager...
AuthManager deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

Deploying VotingContract...
VotingContract deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

📝 **IMPORTANT:** Note these addresses! They should be:
- AuthManager: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- VotingContract: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

### Step 6: Configure Frontend Environment
Create `frontend/.env.local` with these **exact** addresses:
```bash
# Deployed VotingContract address on localhost
NEXT_PUBLIC_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

# Deployed AuthManager address on localhost  
NEXT_PUBLIC_AUTH_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# Optional: Get your WalletConnect Project ID from https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=voting-dapp-local
```

### Step 7: Install Frontend Dependencies
```powershell
cd frontend
npm install
```

### Step 8: Start Frontend Development Server
```powershell
npm run dev
```

The app should open at: http://localhost:3000

## 🦊 MetaMask Setup

### Add Localhost Network to MetaMask:
1. Open MetaMask
2. Click the network dropdown (top center)
3. Click "Add network" → "Add a network manually"
4. Enter these details:
   - **Network name:** `Localhost 8545`
   - **New RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `1337`
   - **Currency symbol:** `ETH`
5. Click "Save"
6. **Switch to this network**

### Import Admin Account (Optional):
To access admin features, import the Hardhat test account:
1. In MetaMask, click account icon → "Import Account"
2. Paste this private key: 
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
3. You should see 10000 ETH balance
4. This account is pre-registered as admin with:
   - Username: `admin`
   - Password: `admin`

## 🧪 Testing the Application

### Test Registration (New User):
1. Go to http://localhost:3000/register
2. Click "Connect MetaMask"
3. Approve the connection in MetaMask
4. Enter username and password
5. Click "Register"
6. Confirm the transaction in MetaMask
7. Wait for confirmation
8. You'll be redirected to login

### Test Login (Existing Admin):
1. Switch to the imported Hardhat account in MetaMask
2. Go to http://localhost:3000/login
3. Click "Connect MetaMask"
4. Enter:
   - Username: `admin`
   - Password: `admin`
5. Click "Sign in"
6. You should be logged in as admin

### Test Admin Panel:
1. After logging in as admin, go to http://localhost:3000/admin
2. You should see the admin interface
3. Try adding a candidate:
   - Enter candidate name (e.g., "Alice")
   - Click "Add Candidate"
   - Confirm in MetaMask
4. Try starting an election:
   - Set duration (e.g., 300 seconds)
   - Click "Start Election"
   - Confirm in MetaMask

## 🔧 Troubleshooting

### Issue: "No active wallet found"
**Solution:** 
- Make sure MetaMask is unlocked
- Make sure you're on Localhost 8545 network (Chain ID: 1337)
- Click "Connect MetaMask" button on the page
- Approve the connection

### Issue: "Missing revert data" or "Could not decode result"
**Solution:**
- Contracts aren't deployed or at wrong address
- Check that Hardhat node is still running
- Redeploy contracts: `npx hardhat run scripts/deploy.js --network localhost`
- Update frontend/.env.local with new addresses
- Restart frontend server

### Issue: "User rejected action"
**Solution:**
- You clicked "Reject" in MetaMask
- Try again and click "Confirm"

### Issue: Transaction fails
**Solution:**
- Reset MetaMask account: Settings → Advanced → Reset Account
- Make sure you have enough ETH (test accounts have 10000 ETH)
- Check console for error details

### Issue: Can't connect to localhost:8545
**Solution:**
- Make sure Hardhat node is running
- Check no other service is using port 8545
- Try restarting the Hardhat node

### Issue: Frontend shows old contract data
**Solution:**
- Clear browser cache
- Reset MetaMask account (Settings → Advanced → Reset Account)
- Restart frontend server

## 📁 Project Structure Details

```
VotingDApp/
├── contracts/
│   ├── contracts/
│   │   ├── AuthManager.sol         # User authentication contract
│   │   └── VotingContract.sol      # Main voting logic contract
│   ├── scripts/
│   │   ├── deploy.js               # Deployment script
│   │   └── copy-abi.js            # ABI copy utility
│   ├── test/
│   │   └── voting.test.js         # Contract tests
│   ├── hardhat.config.js          # Hardhat configuration
│   └── package.json
│
├── frontend/
│   ├── pages/
│   │   ├── _app.js                # App wrapper with providers
│   │   ├── index.js               # Home/voting page
│   │   ├── admin.js               # Admin dashboard
│   │   ├── login.js               # Login page
│   │   └── register.js            # Registration page
│   ├── components/
│   │   └── SimpleConnectButton.js # Wallet connection button
│   ├── contexts/
│   │   └── AuthContext.js         # Authentication context
│   ├── utils/
│   │   └── withAuth.js            # Authentication HOC
│   ├── abis/
│   │   ├── AuthManager.json       # AuthManager ABI
│   │   └── VotingContract.json    # VotingContract ABI
│   ├── .env.local                 # Environment variables (create this)
│   └── package.json
│
├── README.md                       # Project documentation
└── SETUP_GUIDE.md                 # This file
```

## 🎯 Development Workflow

### Making Contract Changes:
1. Edit contract in `contracts/contracts/`
2. Compile: `npx hardhat compile`
3. Run tests: `npx hardhat test`
4. Restart Hardhat node
5. Redeploy: `npx hardhat run scripts/deploy.js --network localhost`
6. Update addresses in `frontend/.env.local`
7. Restart frontend server

### Making Frontend Changes:
1. Edit files in `frontend/`
2. Changes hot-reload automatically
3. Check browser console for errors

## 🌐 Deploying to Testnet (Sepolia)

### 1. Get Testnet ETH:
- Visit https://sepoliafaucet.com/
- Enter your wallet address
- Wait for ETH to arrive

### 2. Configure Environment:
Create `contracts/.env`:
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_ID
DEPLOYER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
```

### 3. Deploy:
```powershell
cd contracts
npx hardhat run scripts/deploy.js --network sepolia
```

### 4. Update Frontend:
Update `frontend/.env.local` with deployed addresses

### 5. MetaMask:
Switch MetaMask to Sepolia network

## 🎉 Success Checklist

- [ ] Contracts compile without errors
- [ ] Tests pass successfully
- [ ] Hardhat node is running
- [ ] Contracts deployed successfully
- [ ] Frontend .env.local has correct addresses
- [ ] Frontend server is running
- [ ] MetaMask configured with Localhost network
- [ ] Can connect wallet on frontend
- [ ] Can register a new user
- [ ] Can login as admin
- [ ] Can access admin panel
- [ ] Can add candidates as admin
- [ ] Can start election as admin

## 📞 Need Help?

Check:
1. Browser console for frontend errors
2. Hardhat node terminal for blockchain errors
3. Frontend terminal for build errors
4. MetaMask for transaction details

Common error messages and solutions are in the Troubleshooting section above.
