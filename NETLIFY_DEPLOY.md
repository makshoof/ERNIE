# Deploy to Netlify

## Quick Deploy

### Option 1: Netlify Dashboard (Recommended)

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Fix JSON parsing errors and add Netlify config"
   git push
   ```

2. **Go to Netlify**:
   - Visit [app.netlify.com](https://app.netlify.com)
   - Sign up/Login with GitHub
   - Click "Add new site" → "Import an existing project"

3. **Connect Repository**:
   - Select your GitHub repository
   - Netlify will auto-detect Next.js settings

4. **Build Settings** (should auto-detect):
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Or use the `netlify.toml` file (already configured)

5. **Environment Variables**:
   - Go to Site settings → Environment variables
   - Add: `NOVITA_API_KEY` = `sk_-OEsRD5GECf0IQeBiXqOK-9DcjbxwmPsCVJsj1hz3Mo`
   - Select "Deploy" scope

6. **Deploy**:
   - Click "Deploy site"
   - Wait for build to complete (~2-3 minutes)

### Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize (first time)
netlify init

# Set environment variable
netlify env:set NOVITA_API_KEY sk_-OEsRD5GECf0IQeBiXqOK-9DcjbxwmPsCVJsj1hz3Mo

# Deploy
netlify deploy --prod
```

## Configuration Files

- `netlify.toml` - Netlify build configuration
- `_redirects` - URL redirects for Next.js
- `next.config.js` - Updated for Netlify compatibility

## Troubleshooting

### Build Fails
- Check that `NOVITA_API_KEY` is set in environment variables
- Verify Node.js version (should be 20+)
- Check build logs in Netlify dashboard

### API Errors
- Ensure environment variable is set correctly
- Redeploy after adding environment variables
- Check function logs in Netlify dashboard

## Post-Deployment

Your app will be available at: `https://your-site-name.netlify.app`

To update:
```bash
git push
# Netlify will auto-deploy on push to main branch
```

