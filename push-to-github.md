# Push to GitHub - Quick Guide

## Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `ernie-inspection-assistant` (or any name you prefer)
3. Description: "AI-powered industrial inspection assistant using ERNIE vision-language model"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

## Step 2: Copy Your Repository URL

After creating, GitHub will show you a URL like:
- `https://github.com/YOUR_USERNAME/ernie-inspection-assistant.git`
- OR `git@github.com:YOUR_USERNAME/ernie-inspection-assistant.git`

## Step 3: Run These Commands

Replace `YOUR_USERNAME` and `REPO_NAME` with your actual values:

```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## That's it! 🎉

Your code will be pushed to GitHub and available at:
`https://github.com/YOUR_USERNAME/ernie-inspection-assistant`

