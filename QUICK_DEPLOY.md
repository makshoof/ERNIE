# 🚀 Quick Deploy Guide

## Fastest Way: Vercel (5 minutes)

### Step 1: Push to GitHub

```bash
# If you haven't created a GitHub repo yet:
# 1. Go to github.com and create a new repository
# 2. Then run these commands:

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to**: [vercel.com/new](https://vercel.com/new)
2. **Sign in** with GitHub
3. **Import** your repository
4. **Add Environment Variable**:
   - Key: `NOVITA_API_KEY`
   - Value: `sk_-OEsRD5GECf0IQeBiXqOK-9DcjbxwmPsCVJsj1hz3Mo`
5. **Click Deploy** 🎉

Your app will be live in 2-3 minutes!

---

## Alternative: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (first time)
vercel

# Add environment variable
vercel env add NOVITA_API_KEY

# Deploy to production
vercel --prod
```

---

## ✅ That's it!

Your app will be available at: `https://your-project-name.vercel.app`

**Important**: Make sure to add the `NOVITA_API_KEY` environment variable in Vercel dashboard or the API won't work!

