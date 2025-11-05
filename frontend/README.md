# Frontend (Next.js) — Voting DApp

A Next.js frontend for the Voting DApp using wagmi, RainbowKit, and ethers.js.

## Quick Start

1. **Install dependencies**
   ```powershell
   npm install
   ```

2. **Configure contract address**
   - Copy `.env.example` to `.env.local`
   - Set `NEXT_PUBLIC_CONTRACT_ADDRESS` to your deployed contract address

3. **Run development server**
   ```powershell
   npm run dev
   ```
   - Open http://localhost:3000

## Features

- 🔌 Wallet connection via RainbowKit (MetaMask, WalletConnect, etc.)
- 📊 Live proposal display with vote counts
- ✅ One-click voting for connected wallets
- 🔔 Real-time updates via contract events
- 🎨 Tailwind CSS styling

## Configuration

Get a WalletConnect Project ID from https://cloud.walletconnect.com and update `pages/_app.js` if needed.

## Notes

- The ABI in `abis/Voting.json` is synced automatically when you run `npm run compile` in the contracts folder
- For local testing, deploy to Hardhat network and update the contract address
- For Sepolia, deploy via `npx hardhat run scripts/deploy.js --network sepolia` and use that address

## Deployment

### Vercel
1. Push to GitHub
2. Import in Vercel
3. Set environment variable: `NEXT_PUBLIC_CONTRACT_ADDRESS=0x...`
4. Deploy

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Set environment variable: `NEXT_PUBLIC_CONTRACT_ADDRESS=0x...`
