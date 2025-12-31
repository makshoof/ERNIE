# PowerShell script to push to GitHub
# Run this after creating your GitHub repository

Write-Host "🚀 Pushing ERNIE Inspection Assistant to GitHub" -ForegroundColor Cyan
Write-Host ""

# Get repository URL from user
$repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/repo-name.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ Repository URL is required!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Adding remote origin..." -ForegroundColor Yellow
git remote add origin $repoUrl 2>$null
if ($LASTEXITCODE -ne 0) {
    # Remote might already exist, try to set-url instead
    git remote set-url origin $repoUrl
}

Write-Host "✅ Remote added" -ForegroundColor Green

Write-Host ""
Write-Host "🔄 Renaming branch to main..." -ForegroundColor Yellow
git branch -M main

Write-Host ""
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "🌐 Your repository: $repoUrl" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Failed to push. Please check your repository URL and GitHub credentials." -ForegroundColor Red
}

