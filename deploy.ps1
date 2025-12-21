# ERNIE Inspection Assistant - Deployment Script (PowerShell)
Write-Host "🚀 ERNIE Inspection Assistant - Deployment Script" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version 2>&1
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host ""

# Check if logged in
try {
    $whoami = vercel whoami 2>&1
    Write-Host "✅ Already logged in: $whoami" -ForegroundColor Green
} catch {
    Write-Host "🔐 Please login to Vercel..." -ForegroundColor Yellow
    vercel login
}

Write-Host ""
Write-Host "📦 Setting up environment variable..." -ForegroundColor Cyan
Write-Host "Adding NOVITA_API_KEY..." -ForegroundColor Yellow
vercel env add NOVITA_API_KEY production

Write-Host ""
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
vercel --prod

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "Your app is now live!" -ForegroundColor Green

