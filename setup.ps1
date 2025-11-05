# VotingDApp Quick Setup Script
# Run this from the project root

Write-Host "🚀 VotingDApp Quick Setup" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "contracts") -or -not (Test-Path "frontend")) {
    Write-Host "❌ Error: Run this script from the VotingDApp root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Step 1: Installing contract dependencies..." -ForegroundColor Yellow
Set-Location contracts
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install contract dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Contract dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔨 Step 2: Compiling contracts..." -ForegroundColor Yellow
npm run compile
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to compile contracts" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Contracts compiled successfully" -ForegroundColor Green

Write-Host ""
Write-Host "🧪 Step 3: Running tests..." -ForegroundColor Yellow
npx hardhat test
Write-Host "✅ Tests completed" -ForegroundColor Green

Write-Host ""
Write-Host "📦 Step 4: Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ..\frontend
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Frontend dependencies already installed" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Create contracts/.env with your Sepolia RPC URL and private key"
Write-Host "2. Deploy contract: cd contracts; npx hardhat run scripts\deploy.js --network sepolia"
Write-Host "3. Copy the deployed address"
Write-Host "4. Create frontend/.env.local with NEXT_PUBLIC_CONTRACT_ADDRESS=0x..."
Write-Host "5. Run frontend: cd frontend; npm run dev"
Write-Host ""
Write-Host "📚 Read GETTING_STARTED.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""
