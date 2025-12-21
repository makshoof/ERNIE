# Deployment Guide - ERNIE Inspection Assistant

## Quick Deploy to Vercel (Recommended)

Vercel is the easiest and fastest way to deploy Next.js applications.

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub** (if you haven't already):
   ```bash
   # Create a new repository on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

2. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "Add New Project"

3. **Import Your Repository**:
   - Select your GitHub repository
   - Vercel will auto-detect Next.js settings

4. **Configure Environment Variables**:
   - In the "Environment Variables" section, add:
     - **Name**: `NOVITA_API_KEY`
     - **Value**: Your Novita.ai API key (`sk_-OEsRD5GECf0IQeBiXqOK-9DcjbxwmPsCVJsj1hz3Mo`)
   - Click "Add" for each environment

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - When asked about environment variables, add `NOVITA_API_KEY`

4. **Set Environment Variables** (if not done during deploy):
   ```bash
   vercel env add NOVITA_API_KEY
   ```
   - Enter your API key when prompted

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## Alternative Deployment Options

### Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

4. **Set Environment Variables**:
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add `NOVITA_API_KEY`

### Railway

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**:
   ```bash
   railway login
   ```

3. **Initialize**:
   ```bash
   railway init
   ```

4. **Set Environment Variables**:
   ```bash
   railway variables set NOVITA_API_KEY=your_api_key_here
   ```

5. **Deploy**:
   ```bash
   railway up
   ```

### Render

1. **Create Account**: Visit [render.com](https://render.com)

2. **New Web Service**:
   - Connect your GitHub repository
   - Select "Web Service"
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Environment Variables**:
   - Add `NOVITA_API_KEY` in the Environment section

## Pre-Deployment Checklist

- [ ] ✅ Git repository initialized
- [ ] ✅ All files committed
- [ ] ✅ `.env.local` is in `.gitignore` (already done)
- [ ] ✅ API key is ready
- [ ] ✅ Project builds successfully (`npm run build`)

## Post-Deployment Steps

1. **Test Your Deployment**:
   - Visit your deployed URL
   - Upload an image
   - Test the analysis feature

2. **Monitor Logs**:
   - Check Vercel/Netlify dashboard for any errors
   - Monitor API usage in Novita.ai dashboard

3. **Custom Domain** (Optional):
   - In Vercel: Settings → Domains → Add Domain
   - Follow DNS configuration instructions

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Ensure TypeScript compiles without errors: `npm run build`
- Check build logs in deployment platform

### API Errors After Deployment

- Verify `NOVITA_API_KEY` is set correctly in environment variables
- Check that the variable name matches exactly (case-sensitive)
- Restart deployment after adding environment variables

### Images Not Uploading

- Check file size limits (currently 10MB)
- Verify CORS settings if needed
- Check network tab in browser console

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NOVITA_API_KEY` | Your Novita.ai API key | Yes |

## Cost Considerations

- **Vercel**: Free tier includes 100GB bandwidth/month
- **Netlify**: Free tier includes 100GB bandwidth/month
- **Novita.ai API**: Pay-per-use pricing (check their pricing page)

## Security Notes

- ✅ Never commit `.env.local` to git (already in `.gitignore`)
- ✅ Use environment variables in deployment platform
- ✅ API keys are server-side only (never exposed to client)
- ✅ Consider rate limiting for production use

