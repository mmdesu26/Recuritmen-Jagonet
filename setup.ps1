# Setup Script untuk Windows PowerShell
# Jalankan dengan: .\setup.ps1

Write-Host "🚀 Setup Jagonet Recruitment System" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "📦 Checking Node.js..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion installed" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found! Please install Node.js 18+ first" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Install missing packages
Write-Host ""
Write-Host "📦 Installing additional packages..." -ForegroundColor Yellow
npm install tsx @radix-ui/react-tabs -D
Write-Host "✅ Additional packages installed" -ForegroundColor Green

# Check .env
Write-Host ""
Write-Host "🔧 Checking environment file..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ .env file exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env file not found, creating from example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ .env file created. Please edit it with your configuration!" -ForegroundColor Green
    }
}

# Prisma setup
Write-Host ""
Write-Host "🗃️  Setting up Prisma..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma client generated" -ForegroundColor Green

Write-Host ""
Write-Host "📊 Database Migration..." -ForegroundColor Yellow
Write-Host "⚠️  Make sure MySQL is running and DATABASE_URL is correct in .env" -ForegroundColor Yellow
Write-Host ""
$response = Read-Host "Run database migration? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    npx prisma migrate dev --name init
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database migrated" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
        npx prisma db seed
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Database seeded" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Failed to seed database. You can try manually: npx prisma db seed" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Migration failed. Check your database connection" -ForegroundColor Red
    }
}

# Create upload directory
Write-Host ""
Write-Host "📁 Creating upload directories..." -ForegroundColor Yellow
$uploadDir = "public\uploads\cv"
if (!(Test-Path $uploadDir)) {
    New-Item -ItemType Directory -Path $uploadDir -Force | Out-Null
    Write-Host "✅ Upload directories created" -ForegroundColor Green
} else {
    Write-Host "✅ Upload directories already exist" -ForegroundColor Green
}

# Done
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env file with your configuration" -ForegroundColor White
Write-Host "2. Make sure MySQL is running" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White
Write-Host "4. Open: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "👤 Default admin login:" -ForegroundColor Yellow
Write-Host "   Email: admin@jagonet.com" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "📚 Read PANDUAN.md for detailed instructions" -ForegroundColor Yellow
Write-Host ""

$startNow = Read-Host "Start development server now? (y/n)"
if ($startNow -eq 'y' -or $startNow -eq 'Y') {
    Write-Host ""
    Write-Host "🚀 Starting development server..." -ForegroundColor Cyan
    npm run dev
}
