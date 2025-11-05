# VotingDApp Verification Script
# This script checks if everything is set up correctly

Write-Host "🔍 VotingDApp Setup Verification" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    $errors += "❌ Node.js not found. Please install Node.js v18 or higher"
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm installed: $npmVersion" -ForegroundColor Green
} catch {
    $errors += "❌ npm not found"
}

# Check contracts directory
Write-Host "`nChecking contracts directory..." -ForegroundColor Yellow
if (Test-Path ".\contracts") {
    Write-Host "✅ contracts/ directory exists" -ForegroundColor Green
    
    # Check package.json
    if (Test-Path ".\contracts\package.json") {
        Write-Host "✅ contracts/package.json exists" -ForegroundColor Green
    } else {
        $errors += "❌ contracts/package.json not found"
    }
    
    # Check node_modules
    if (Test-Path ".\contracts\node_modules") {
        Write-Host "✅ contracts/node_modules exists" -ForegroundColor Green
    } else {
        $warnings += "⚠️  contracts/node_modules not found. Run: cd contracts; npm install"
    }
    
    # Check contracts
    if (Test-Path ".\contracts\contracts\VotingContract.sol") {
        Write-Host "✅ VotingContract.sol exists" -ForegroundColor Green
    } else {
        $errors += "❌ VotingContract.sol not found"
    }
    
    if (Test-Path ".\contracts\contracts\AuthManager.sol") {
        Write-Host "✅ AuthManager.sol exists" -ForegroundColor Green
    } else {
        $errors += "❌ AuthManager.sol not found"
    }
    
    # Check hardhat.config.js
    if (Test-Path ".\contracts\hardhat.config.js") {
        Write-Host "✅ hardhat.config.js exists" -ForegroundColor Green
    } else {
        $errors += "❌ hardhat.config.js not found"
    }
    
} else {
    $errors += "❌ contracts/ directory not found"
}

# Check frontend directory
Write-Host "`nChecking frontend directory..." -ForegroundColor Yellow
if (Test-Path ".\frontend") {
    Write-Host "✅ frontend/ directory exists" -ForegroundColor Green
    
    # Check package.json
    if (Test-Path ".\frontend\package.json") {
        Write-Host "✅ frontend/package.json exists" -ForegroundColor Green
    } else {
        $errors += "❌ frontend/package.json not found"
    }
    
    # Check node_modules
    if (Test-Path ".\frontend\node_modules") {
        Write-Host "✅ frontend/node_modules exists" -ForegroundColor Green
    } else {
        $warnings += "⚠️  frontend/node_modules not found. Run: cd frontend; npm install"
    }
    
    # Check .env.local
    if (Test-Path ".\frontend\.env.local") {
        Write-Host "✅ frontend/.env.local exists" -ForegroundColor Green
        
        # Check if it has the required variables
        $envContent = Get-Content ".\frontend\.env.local" -Raw
        if ($envContent -match "NEXT_PUBLIC_CONTRACT_ADDRESS") {
            Write-Host "✅ NEXT_PUBLIC_CONTRACT_ADDRESS found" -ForegroundColor Green
        } else {
            $warnings += "⚠️  NEXT_PUBLIC_CONTRACT_ADDRESS not set in .env.local"
        }
        
        if ($envContent -match "NEXT_PUBLIC_AUTH_CONTRACT_ADDRESS") {
            Write-Host "✅ NEXT_PUBLIC_AUTH_CONTRACT_ADDRESS found" -ForegroundColor Green
        } else {
            $warnings += "⚠️  NEXT_PUBLIC_AUTH_CONTRACT_ADDRESS not set in .env.local"
        }
    } else {
        $warnings += "⚠️  frontend/.env.local not found. Create it with contract addresses"
    }
    
    # Check ABIs
    if (Test-Path ".\frontend\abis\VotingContract.json") {
        Write-Host "✅ VotingContract.json ABI exists" -ForegroundColor Green
    } else {
        $warnings += "⚠️  VotingContract.json ABI not found. Run: cd contracts; npx hardhat compile"
    }
    
    if (Test-Path ".\frontend\abis\AuthManager.json") {
        Write-Host "✅ AuthManager.json ABI exists" -ForegroundColor Green
    } else {
        $warnings += "⚠️  AuthManager.json ABI not found. Run: cd contracts; npx hardhat compile"
    }
    
    # Check key pages
    $pages = @("_app.js", "index.js", "admin.js", "login.js", "register.js")
    foreach ($page in $pages) {
        if (Test-Path ".\frontend\pages\$page") {
            Write-Host "✅ pages/$page exists" -ForegroundColor Green
        } else {
            $errors += "❌ pages/$page not found"
        }
    }
    
} else {
    $errors += "❌ frontend/ directory not found"
}

# Check if port 8545 is in use (Hardhat node)
Write-Host "`nChecking Hardhat node..." -ForegroundColor Yellow
try {
    $connection = Test-NetConnection -ComputerName localhost -Port 8545 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    if ($connection.TcpTestSucceeded) {
        Write-Host "✅ Hardhat node appears to be running on port 8545" -ForegroundColor Green
    } else {
        $warnings += "⚠️  Hardhat node not running. Run: cd contracts; npx hardhat node"
    }
} catch {
    $warnings += "⚠️  Could not check if Hardhat node is running"
}

# Check if port 3000 is in use (Frontend dev server)
Write-Host "Checking frontend server..." -ForegroundColor Yellow
try {
    $connection = Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    if ($connection.TcpTestSucceeded) {
        Write-Host "✅ Frontend server appears to be running on port 3000" -ForegroundColor Green
    } else {
        $warnings += "⚠️  Frontend server not running. Run: cd frontend; npm run dev"
    }
} catch {
    $warnings += "⚠️  Could not check if frontend server is running"
}

# Summary
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "📊 Verification Summary" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "`n🎉 All checks passed! Your setup looks good!" -ForegroundColor Green
    Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Make sure Hardhat node is running: cd contracts; npx hardhat node" -ForegroundColor White
    Write-Host "2. Deploy contracts: cd contracts; npx hardhat run scripts\deploy.js --network localhost" -ForegroundColor White
    Write-Host "3. Start frontend: cd frontend; npm run dev" -ForegroundColor White
    Write-Host "4. Open http://localhost:3000 in your browser" -ForegroundColor White
} else {
    if ($errors.Count -gt 0) {
        Write-Host "`n❌ Errors found:" -ForegroundColor Red
        foreach ($error in $errors) {
            Write-Host "  $error" -ForegroundColor Red
        }
    }
    
    if ($warnings.Count -gt 0) {
        Write-Host "`n⚠️  Warnings:" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "  $warning" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`n📖 See SETUP_GUIDE.md for detailed setup instructions" -ForegroundColor Cyan
}

Write-Host ""
